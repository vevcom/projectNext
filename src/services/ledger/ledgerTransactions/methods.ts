import { RequireNothing } from '@/auth/auther/RequireNothing'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { ServiceMethod } from '@/services/ServiceMethod'
import { LedgerTransactionPurpose } from '@prisma/client'
import type { Prisma } from '@prisma/client'
import { z } from 'zod'
import { LedgerAccountMethods } from '../ledgerAccount/methods'
import { ServerError } from '@/services/error'
import { calculateCreditFees, calculateDebitFees } from './calculateFees'
import { determineTransactionState } from './determineTransactionState'

export namespace LedgerTransactionMethods {
    /**
     * Reads a single transaction including its ledger entries, payment and manual transfer (if any).
     */
    export const read = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ prisma, params }) => {
            const transaction = await prisma.ledgerTransaction.findUniqueOrThrow({
                where: {
                    id: params.id,
                },
                include: {
                    ledgerEntries: true,
                    payment: true,
                    manualTransfer: true,
                },
            })

            return transaction
        }
    })

    /**
     * Read several ledger transactions including its ledger entries, payment and manual transfer (if any).
     */
    export const readPage = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                accountId: z.number(),
            }),
        ),
        method: async ({ prisma, params }) => prisma.ledgerTransaction.findMany({
            where: {
                ledgerEntries: {
                    some: {
                        ledgerAccountId: params.paging.details.accountId,
                    },
                },
            },
            include: {
                ledgerEntries: true,
                payment: true,
                manualTransfer: true,
            },
            orderBy: {
                createdAt: 'desc',
                id: 'desc',
            },
            ...cursorPageingSelection(params.paging.page)
        })
    })

    /**
     * Create a new transaction on the ledger with the given entries and optionally 
     * link to the provided payment and/or manual transfer.
     * 
     * The fees transferred are automatically calculated.
     * 
     * The lifecycle of the transaction is automatically handled by the system.
     */
    export const create = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO,
        paramsSchema: z.object({
            purpose: z.nativeEnum(LedgerTransactionPurpose),
            ledgerEntries: z.object({
                amount: z.number(),
                ledgerAccountId: z.number(),
            }).array(),
            paymentId: z.number().optional(),
            manualTransferId: z.number().optional(),
        }),
        method: async ({ prisma, session, params }, ) => {
            // Calculate the balance for all accounts which are going to be deducted
            const debitEntries = params.ledgerEntries.filter(entry => entry.amount < 0)
            const balances = await LedgerAccountMethods.calculateBalances.client(prisma).execute({
                params: { ids: debitEntries.map(entry => entry.ledgerAccountId) },
                session: null,
            })

            // Check that the relevant accounts have enough balance to do the transaction.
            // NOTE: This is check is only to avoid calling the db unnecessarily.
            // The actual validation is handled in the `advance` function.
            const hasInsufficientBalance = debitEntries.some(entry => entry.amount > balances[entry.ledgerAccountId].amount)
            if (hasInsufficientBalance) {
                throw new ServerError('BAD PARAMETERS', 'Konto har for lav balanse for å utføre transaksjonen.')
            }

            // Calculate and set fees for the debit entries 
            const fees = calculateDebitFees(params.ledgerEntries, balances)
            const entries = params.ledgerEntries.map(entry => ({ 
                ...entry, 
                fees: fees[entry.ledgerAccountId] ?? null
            }))

            const { id } = await prisma.ledgerTransaction.create({
                data: {
                    purpose: params.purpose,
                    status: 'PENDING',
                    ledgerEntries: {
                        create: entries,
                    },
                    paymentId :params.paymentId,
                    manualTransferId: params.manualTransferId,
                },
                select: {
                    id: true,
                },
            })
        
            const transaction = await advance.client(prisma).execute({
                params: {
                    id,
                },
                session,
            })

            if (transaction.status === 'FAILED') {
                // TODO: Better error message.
                throw new ServerError('BAD PARAMETERS', 'Ugyldig transaksjon.')
            }

            return transaction
        } 
    })

    /**
     * Tries to advance the transactions state to a terminal state.
     * Also, updates the fees if possible.
     */
    export const advance = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ session, prisma, params}) => {
            const transaction = await read.client(prisma).execute({
                params: { id: params.id },
                session,
            })

            const creditFees = calculateCreditFees(transaction.ledgerEntries, transaction.payment, transaction.manualTransfer)

            if (creditFees) {
                const creditEntries = transaction.ledgerEntries.filter(entry => entry.amount > 0)

                const ledgerEntryUpdateInput = creditEntries.map(entry => ({
                    where: {
                        id: entry.id,
                    },
                    data: {
                        fees: creditFees[entry.ledgerAccountId],
                    },
                })) satisfies Prisma.LedgerEntryUpdateWithWhereUniqueWithoutLedgerTransactionInput[] // X_x

                await prisma.ledgerTransaction.update({
                    where: {
                        id: params.id,
                    },
                    data: {
                        ledgerEntries: {
                            update: ledgerEntryUpdateInput,
                        },
                    },
                    select: {},
                })

                transaction.ledgerEntries.forEach(
                    entry => entry.fees = creditFees[entry.ledgerAccountId] ?? entry.fees
                )
            }

            const balances = await LedgerAccountMethods.calculateBalances.client(prisma).execute({
                params: {
                    ids: transaction.ledgerEntries.map(entry => entry.ledgerAccountId),
                    atTransactionId: transaction.id,
                },
                session: null,
            })

            const transactionStatus = await determineTransactionState(transaction, balances)

            // We use `updateMany` in stead of just `update` here because
            // we don't want to throw in case the record is not found.
            await prisma.ledgerTransaction.updateMany({
                where: {
                    id: params.id,
                    status: 'PENDING', // Protect against changing final state.
                },
                data: {
                    status: transactionStatus,
                    // TODO: Add message detailing why a transaction failed if it did.
                },
            })
            
            return read.client(prisma).execute({
                params: { id: params.id },
                session,
            })
        }
    })
}

    // MIGHT NOT BE NEEDED
    /**
     * Cancel a pending transaction. If the payment is processing it will be cancel
     */
    // export const cancel = ServiceMethod({
    //     auther: () => RequireNothing.staticFields({}).dynamicFields({}),
    //     method: async () => {

    //     }
    // })

/*


        ///////////////////////////////////////////////////////////////////////////////////////
        // All ledger entries must have either a ledger account, payment or manualTransfer attached. //
        // Multiple or none are not allowed. (The money must come from/go to somewhere.)     //
        ///////////////////////////////////////////////////////////////////////////////////////

        // Utility function for checking that an object has exactly one of the provided keys
        function exactlyOneOf<T>(obj: T, keys: (keyof T)[]): boolean {
            return keys.filter(key => obj[key] !== null).length === 1
        }

        const onlySingleAttachments = transaction.ledgerEntries.every(
            entry => exactlyOneOf(entry, ['ledgerAccountId', 'paymentId', 'manualTransferId'])
        )

        if (!onlySingleAttachments) {
            return 'FAILED'
        }

// The output from the Prisma `groupBy` method is an array.
            // We convert it to an object (record) as it is more sensible for lookups. 
            const balanceRecord = Object.fromEntries(
                // The "as const"s are required so that TS understands that the arrays
                // have a length of exactly two.
                [
                    // Set all ids to zero by default in case some ledger accounts do not have
                    // any ledger entries yet.
                    ...params.ids.map(id => [id, { amount: 0, fees: 0 }] as const),
                    // Map the array returned by `groupBy` to key value pairs. 
                    ...balanceArray.map(balance => [
                        // The "!" is required because the typing for `fromEntries` doesn't accept
                        // null as a key. (Even though all keys just get converted to strings during
                        // runtime.) The query above guarantees that the id can never be null so
                        // its safe anyhow. 
                        balance.ledgerAccountId!, 
                        {
                            // Prisma sets sum to "null" in case the only rows which exist are null.
                            // For our case we can treat it as zero.
                            amount: balance._sum.amount ?? 0,
                            fees: balance._sum.fees ?? 0,  
                        },
                    ] as const),
                ]
            )

// The object returned by `fromEntries` assumes that all keys map to the provided type.
// This is obviously not true so we need to assert the record as partial.

async function createPurchase() {
    const [transaction, purchase] = await prisma.$transaction(async (tx) => {
        // Call stripe api and do internal money transfer
        const createTransaction({ 
            ledgerEntries: [
                {
                    accountId: sellerAccountId,
                    amount:    productPrice,
                },
                {
                    accountId: buyerAccountId,
                    amount:   -productPrice,
                },
            ],
        })

        // Create record of what should be bought
        const purchase = purchases.create({
            productsPurchases: [{productId: ..., price: ..., quantity: ...}, ...],
            userId: ...,
            transactionId: transaction.id,
        })

        return [transaction, purchase]
    })
 
    return [transaction, purchase]
}

*/

/*

async function createDeposit(...) {
    const paymentId = cuid()

    await prisma.$transaction(async (tx) => {
        // Create the transaction
        // The entries must always sum to zero - money cannot come from nowhere
        await createTransaction({
            client: tx, 
            purpose: 'DEPOSIT',
            entries: [
                {
                    amount: depositAmount,
                    accountId,
                },
                {
                    amount: -depositAmount,
                    paymentId,
                    create: true,
                },
            ],
        })
    
        return payment
    })

    // Call the Stripe API and return the client secret so the user can complete the transaction
    return await initiatePayment({
        // Implicitly global prisma
        paymentId: payment.id
    })
}

*/

// POST /purchase

// async function createPurchase() {
//     const transaction = await prisma.$transaction(async (tx) => {
//         // Create record of what should be bough20222t
//         const purchase = purchases.create({
//             productsPurchases: [{productId: ..., price: ..., quantity: ...}, ...],
//             userId: ...,
//         })

//         // Call stripe api and do internal money transfer
//         return await transactios.create({
//             totalAmount: ...,
//             toAccountId: ...,
//             fromAccountId: ...,
//             purpose: 'PURCHASE',
//             purchaseId:  purchase.id,
//         })
//     })
// }

// async function createEventPayment() {
//     await prisma.$transaction(async (tx) => {
//         return await transactios.create({
//             totalAmount: ...,
//             toAccountId: ...,
//             fromAccountId: ...,
//             purpose: 'EVENT_PAYMENT',
//             eventRegistrations: eventRegistration.id,
//         })
//     })
// }

// async function createDeposit() {
//     const paymentIntent = await stripe.paymentIntents.create({
        
//     })

//     await prisma.$transaction(async (tx) => {
//         return await transactios.create({
//             totalAmount: ...,
//             toAccountId: ...,
//             purpose: 'DEPOSIT',
//         })
//     })
// }

// async function createmanualTransfer() {
//     await prisma.$transaction(async (tx) => {
//         return await transactios.create({
//             toAccountId: null,
//             fromAccountId: ...,
//             totalAmount: ...,
//             purpose: 'manualTransfer',
//         })
//     })
// }

/*
// Checks if the source account has enough balance and that the payment (if present) is successful.
    async function validateTransaction(prisma: Prisma.TransactionClient, id: number): Promise<boolean> {
        const transaction = await prisma.ledgerTransaction.findUniqueOrThrow({
            where: { id },
            // Only query the fields we need for validation
            select: {
                id: true,
                fromAccountId: true,
                status: true,
                payment: {
                    select: {
                        status: true,
                    }
                },
                transfer: {
                    // We only need to know if transfer is present or not
                    select: {}, 
                },
            }
        })

        // A failed transaction can never be valid
        if (transaction.status === 'FAILED') return false

        // A transaction is not valid until its underlying payment is successful (if it has one)
        if (transaction.payment?.status !== 'SUCCEEDED') return false
        
        // A transaction with a transfer must...
        if (transaction.transfer !== null) {
            // ...have a fromAccount (the money must come from somewhere)
            if (transaction.fromAccountId === null) return false

            const fromAccountBalance = await LedgerAccountMethods.calculateBalance.client(prisma).execute({
                params: {
                    id: transaction.fromAccountId,
                    atTransactionId: transaction.id,
                },
                bypassAuth: true,
                session: null,
            })

            // ...and result in a non-negative balance for the fromAccount
            if (fromAccountBalance.amount < 0) return false
        }

        return true
    }
*/