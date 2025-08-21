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
            const hasInsufficientBalance = debitEntries.some(entry => (balances[entry.ledgerAccountId]?.amount ?? 0) + entry.amount < 0)
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
                throw new ServerError('BAD PARAMETERS', transaction.reason ?? 'Transaksjonen feilet av ukjent årsak.')
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
            let transaction = await read.client(prisma).execute({
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

            const transition = await determineTransactionState(transaction, balances)

            // We use `updateMany` in stead of just `update` here because
            // we don't want to throw in case the record is not found.
            await prisma.ledgerTransaction.updateMany({
                where: {
                    id: params.id,
                    status: 'PENDING', // Protect against changing final state.
                },
                data: transition,
            })
            
            transaction = await read.client(prisma).execute({
                params: { id: params.id },
                session,
            })

            return transaction
        }
    })
}
