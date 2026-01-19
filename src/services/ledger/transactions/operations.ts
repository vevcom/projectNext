import { calculateCreditFees, calculateDebitFees } from './calculateFees'
import { determineTransactionState } from './determineTransactionState'
import { ledgerAccountOperations } from '@/services/ledger/accounts/operations'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { ServerError } from '@/services/error'
import { defineOperation } from '@/services/serviceOperation'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { z } from 'zod'
import type { ExpandedLedgerTransaction } from './types'
import type { Prisma } from '@/prisma-generated-pn-types'
import { LedgerTransactionPurpose } from '@/prisma-generated-pn-types'

export const ledgerTransactionOperations = {
    /**
     * Reads a single transaction including its ledger entries, payment and manual transfer (if any).
     */
    read: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: async ({ prisma, params }) => {
            const transaction = await prisma.ledgerTransaction.findUniqueOrThrow({
                where: {
                    id: params.id,
                },
                include: {
                    ledgerEntries: true,
                    payment: {
                        include: {
                            stripePayment: true,
                            manualPayment: true,
                        },
                    },
                },
            })

            return transaction
        }
    }),

    /**
     * Read several ledger transactions including its ledger entries, payment and manual transfer (if any).
     */
    readPage: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                accountId: z.number(),
            }),
        ),
        operation: async ({ prisma, params }) => await prisma.ledgerTransaction.findMany({
            where: {
                ledgerEntries: {
                    some: {
                        ledgerAccountId: params.paging.details.accountId,
                    },
                },
            },
            include: {
                ledgerEntries: true,
                payment: {
                    include: {
                        stripePayment: true,
                        manualPayment: true,
                    },
                },
            },
            orderBy: [
                { createdAt: 'desc' },
                { id: 'desc' },
            ],
            ...cursorPageingSelection(params.paging.page)
        })
    }),

    /**
     * Tries to advance the transactions state to a terminal state.
     * Also, updates the fees if possible.
     */
    advance: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: async ({ prisma, params }) => {
            let transaction: ExpandedLedgerTransaction = await ledgerTransactionOperations.read({
                params: { id: params.id },
            })

            const creditFees = calculateCreditFees(transaction.ledgerEntries, transaction.payment)

            // Update credit fees if they could be calculated.
            // Credit fees are null while the payment is pending, since
            // the final fees are unknown until the payment is completed.
            if (creditFees) {
                const creditEntries = transaction.ledgerEntries.filter(entry => entry.funds > 0)

                const ledgerEntryUpdateInput = creditEntries.map(entry => ({
                    where: {
                        id: entry.id,
                    },
                    data: {
                        fees: creditFees[entry.ledgerAccountId],
                    },
                })) satisfies Prisma.LedgerEntryUpdateWithWhereUniqueWithoutLedgerTransactionInput[] // X_x

                // TODO: Figure out a way to not throw here.
                await prisma.ledgerTransaction.update({
                    where: {
                        id: params.id,
                        state: 'PENDING', // Protect against modifying a completed transaction.
                    },
                    data: {
                        ledgerEntries: {
                            update: ledgerEntryUpdateInput,
                        },
                    },
                })

                transaction.ledgerEntries.forEach(entry => {
                    entry.fees = creditFees[entry.ledgerAccountId] ?? entry.fees
                })
            }

            const balances = await ledgerAccountOperations.calculateBalances({
                params: {
                    ids: transaction.ledgerEntries.map(entry => entry.ledgerAccountId),
                    atTransactionId: transaction.id,
                },
            })

            // Find frozen accounts, if any, among the involved ledger accounts.
            const frozenAccounts = await prisma.ledgerAccount.findMany({
                where: {
                    id: {
                        in: transaction.ledgerEntries.map(entry => entry.ledgerAccountId),
                    },
                    frozen: true,
                }
            })
            const frozenAccountIds = new Set(frozenAccounts.map(account => account.id))

            const transition = await determineTransactionState({ transaction, balances, frozenAccountIds })

            // We use `updateMany` in stead of just `update` here because
            // we don't want to throw in case the record is not found.
            await prisma.ledgerTransaction.updateMany({
                where: {
                    id: params.id,
                    state: 'PENDING', // Protect against changing final state.
                },
                data: transition,
            })

            transaction = await ledgerTransactionOperations.read({
                params: { id: params.id },
            })

            return transaction
        }
    }),

    /**
     * Create a new transaction on the ledger with the given entries and optionally
     * link to the provided payment and/or manual transfer.
     *
     * The fees transferred are automatically calculated.
     *
     * The lifecycle of the transaction is automatically handled by the system.
     */
    create: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO,
        paramsSchema: z.object({
            purpose: z.nativeEnum(LedgerTransactionPurpose),
            ledgerEntries: z.object({
                funds: z.number(),
                ledgerAccountId: z.number(),
            }).array(),
            paymentId: z.number().optional(),
        }),
        operation: async ({ prisma, params }) => {
            // Calculate the balance for all accounts which are going to be deducted.
            const debitEntries = params.ledgerEntries.filter(entry => entry.funds < 0)
            const balances = await ledgerAccountOperations.calculateBalances({
                params: { ids: debitEntries.map(entry => entry.ledgerAccountId) },
            })

            // Check that the relevant accounts have enough balance to do the transaction.
            // NOTE: This is check is only to avoid calling the db unnecessarily.
            // The actual validation is handled in the `advance` function.
            const hasInsufficientBalance = debitEntries.some(
                entry => (balances[entry.ledgerAccountId]?.amount ?? 0) + entry.funds < 0
            )
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
                    state: 'PENDING',
                    ledgerEntries: {
                        create: entries,
                    },
                    paymentId: params.paymentId,
                },
                select: {
                    id: true,
                },
            })

            const transaction: ExpandedLedgerTransaction = await ledgerTransactionOperations.advance({
                params: {
                    id,
                },
            })

            if (transaction.state === 'FAILED') {
                // TODO: Better error message.
                throw new ServerError('BAD PARAMETERS', transaction.reason ?? 'Transaksjonen feilet av ukjent årsak.')
            }

            return transaction
        }
    }),
}
