import { RequireNothing } from '@/auth/auther/RequireNothing'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { ServiceMethod } from '@/services/ServiceMethod'
import { LedgerTransactionPurpose } from '@prisma/client'
import type { Prisma, LedgerTransactionStatus, PaymentStatus } from '@prisma/client'
import { z } from 'zod'
import { LedgerAccountMethods } from '../ledgerAccount/methods'

export namespace LedgerTransactionMethods {
    // TODO FOR IMORGEN:
    // - Splitte validate transaction i to
    // - Finne ut hvordan man setter sammen balanse kalkulasjon
    // - Integrere med shop hvis tid
    // - Se litt på frontend hvis gidder

    /**
     * Checks that the participating attachments have enough balance to do a given transaction.
     */
    async function determineTransactionStatus(prisma: Prisma.TransactionClient, id: number): Promise<LedgerTransactionStatus> {
        const { ledgerEntries, payment, payout, status } = await prisma.ledgerTransaction.findUniqueOrThrow({
            where: { id },
            select: {
                status: true,
                ledgerEntries: true,
                payment: true,
                payout: true,
            },
        })

        // All the rules for a transaction to be valid are written in styled boxes.

        // NOTE: The order of the rules are important!

        ///////////////////////////////////////////////////////////////////////
        // A transaction in a terminal state (SUCCEEDED, FAILED or CANCELED) //
        // can never change state,                                           //
        ///////////////////////////////////////////////////////////////////////

        if (status !== 'PENDING') return status

        ///////////////////////////////////////////////////////////////////
        // If any payment has failed, the entire transaction has failed. //
        ///////////////////////////////////////////////////////////////////

        const okStates: PaymentStatus[] = ['PENDING', 'PROCESSING', 'SUCCEEDED']
        const hasFailedPayment = payment && !okStates.includes(payment.status) 

        if (hasFailedPayment) {
            return 'FAILED'
        }

        ///////////////////////////////////////////////////////////////////
        // Payments and payouts may only have positive amounts and fees. //
        ///////////////////////////////////////////////////////////////////

        const validPayment = !payment || (payment.amount > 0 && (!payment.fees || payment.fees > 0))
        const validPayout  = !payout  || (payout.amount  > 0 && (!payout.fees  || payout.fees  > 0))
        
        if (!validPayout || !validPayment) {
            return 'FAILED'
        }

        /////////////////////////////////////////////////////////////////////////////////////
        // If amount and fees are both non-zero in an entry, they must have the same sign. //
        /////////////////////////////////////////////////////////////////////////////////////

        const validLedgerEntries = ledgerEntries.every(entry => 
            !entry.amount || !entry.fees || Math.sign(entry.amount) === Math.sign(entry.fees)
        )

        if (!validLedgerEntries) {
            return 'FAILED'
        }

        /////////////////////////////////////////////////////////////////
        // Kirchhoff's first law! The sum of all amounts must be zero. //
        // I.e. money must come from somewhere and go to somewhere.    //
        /////////////////////////////////////////////////////////////////
        
        // NOTE: Since the number of entries in a transaction is generally low (max two) we can
        // sum the amounts and fees in memory rather than doing a database aggregation.
        const ledgerEntriesAmountSum = ledgerEntries.reduce((sum, entry) => sum + entry.amount, 0)
        const paymentAmount = payment?.amount ?? 0
        const payoutAmount = payout?.amount ?? 0

        if (ledgerEntriesAmountSum + payoutAmount !== paymentAmount) {
            return 'FAILED'
        }

        ////////////////////////////////////////////////////////////////////
        // If an entry is debit (amount < 0), its referenced account must //
        // have a positive balance after the transaction succeeds.        //
        ////////////////////////////////////////////////////////////////////

        const debitLedgerAccountIds = ledgerEntries.filter(entry => entry.amount < 0).map(entry => entry.ledgerAccountId)

        if (debitLedgerAccountIds) {
            const balances = await LedgerAccountMethods.calculateBalances.client(prisma).execute({
                params: {
                    ids: debitLedgerAccountIds,
                    atTransactionId: id,
                },
                session: null,
            })
    
            const hasNegativeBalance = Object.values(balances).some(balance => balance.amount < 0 || balance.fees < 0)
    
            if (hasNegativeBalance) {
                return 'FAILED'
            }
        } 

        ////////////////////////////////////////////////////////////
        // If any payment is pending, the transaction is pending. // 
        ////////////////////////////////////////////////////////////

        // Since we have checked for failure states above,
        // we can simply check that the transaction has not succeeded.
        const hasPendingPayment = payment && payment.status !== 'SUCCEEDED'

        if (hasPendingPayment) {
            return 'PENDING'
        }

        // NOTE: Since fees are not known until the payment (if any) completes, 
        // the checks must be run afterwards.

        ////////////////////////////////
        // All fees must be non-null. //
        ////////////////////////////////

        const hasNullFees = 
            ledgerEntries.some(entry => entry.fees === null) ||
            payment && payment.fees === null ||
            payout && payout.fees === null

        if (hasNullFees) {
            return 'FAILED'
        }

        //////////////////////////////////////////////////
        // Fees must also follow Kirchhoff's first law. //
        //////////////////////////////////////////////////

        // NOTE: Since the number of entries in a transaction is generally low (max two) we can
        // sum the amounts and fees in memory rather than doing a database aggregation.
        const ledgerEntriesFeesSum = ledgerEntries.reduce((sum, entry) => sum + entry.fees!, 0)
        const paymentFees = payment?.fees ?? 0
        const payoutFees = payout?.fees ?? 0

        if (ledgerEntriesFeesSum + payoutFees !== paymentFees) {
            return 'FAILED'
        }

        return 'SUCCEEDED'
    }

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
                    payout: true,
                },
            })

            return transaction
        }
    })

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
                payout: true,
            },
            orderBy: {
                createdAt: 'desc',
                id: 'desc',
            },
            ...cursorPageingSelection(params.paging.page)
        })
    })

    export const create = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO,
        paramsSchema: z.object({
            purpose: z.nativeEnum(LedgerTransactionPurpose),
            ledgerEntries: z.object({
                amount: z.number(),
                ledgerAccountId: z.number(),
            }).array(),
            paymentId: z.number().optional(),
            payoutId: z.number().optional(),
        }),
        method: async ({ prisma, session, params }, ) => {
            const { id } = await prisma.ledgerTransaction.create({
                data: {
                    purpose: params.purpose,
                    status: 'PENDING',
                    ledgerEntries: {
                        create: params.ledgerEntries,
                    },
                    paymentId: params.paymentId,
                    payoutId: params.payoutId,
                },
                select: {
                    id: true,
                },
            })
        
            const transaction = await updateStatus.client(prisma).execute({
                params: {
                    id,
                },
                session,
            })

            return transaction
        } 
    })

    /**
     * Tries to update a given transaction to a state.
     * If the transaction is valid and possible (all payments completed, enough balance, etc...) the state is set to succeeded.
     * If anything has failed 
     */
    export const updateStatus = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ session, prisma, params}) => {
            const transactionStatus = await determineTransactionStatus(prisma, params.id)

            // We use `updateMany` in stead of just `update` here because
            // we don't want to throw in case the record is not found.
            await prisma.ledgerTransaction.updateMany({
                where: {
                    id: params.id,
                    status: 'PENDING',
                },
                data: {
                    status: transactionStatus,
                },
            })
            
            return await read.client(prisma).execute({
                params: {
                    id: params.id,
                },
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
        // All ledger entries must have either a ledger account, payment or payout attached. //
        // Multiple or none are not allowed. (The money must come from/go to somewhere.)     //
        ///////////////////////////////////////////////////////////////////////////////////////

        // Utility function for checking that an object has exactly one of the provided keys
        function exactlyOneOf<T>(obj: T, keys: (keyof T)[]): boolean {
            return keys.filter(key => obj[key] !== null).length === 1
        }

        const onlySingleAttachments = transaction.ledgerEntries.every(
            entry => exactlyOneOf(entry, ['ledgerAccountId', 'paymentId', 'payoutId'])
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

// async function createPayout() {
//     await prisma.$transaction(async (tx) => {
//         return await transactios.create({
//             toAccountId: null,
//             fromAccountId: ...,
//             totalAmount: ...,
//             purpose: 'PAYOUT',
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