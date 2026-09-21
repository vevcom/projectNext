import { calculateCreditFees, calculateDebitFees } from './calculateFees'
import { determineTransactionState } from './determineTransactionState'
import { ledgerTransactionAuth } from './auth'
import { ledgerAccountOperations } from '@/services/ledger/accounts/operations'
import { resolveAccountOwnership, resolveAccountsOwnership } from '@/services/ledger/accounts/ownership'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { ServerError } from '@/services/error'
import { defineOperation } from '@/services/serviceOperation'
import { andAuthorizers } from '@/auth/authorizer/andAuthorizers'
import logger from '@/lib/logger'
import { LedgerTransactionPurpose } from '@/prisma-generated-pn-types'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client'
import { z } from 'zod'
import type { ExpandedLedgerTransaction } from './types'
import type { Prisma } from '@/prisma-generated-pn-types'

// Nested calls to other operations are not bypassed unless noted: the checks involved are cheap,
// so it is worth checking access again rather than assuming the outer check already covered it.
export const ledgerTransactionOperations = {
    /**
     * Reads a single transaction including its ledger entries, payment and manual transfer (if any).
     */
    read: defineOperation({
        authorizer: async ({ params, prisma }) => {
            const transaction = await prisma.ledgerTransaction.findUnique({
                where: { id: params.id },
                select: {
                    ledgerEntries: {
                        select: {
                            ledgerAccount: {
                                select: { userId: true, groups: { select: { groupId: true } } },
                            },
                        },
                    },
                },
            })

            const accounts = (transaction?.ledgerEntries ?? []).map(entry => ({
                userId: entry.ledgerAccount?.userId ?? null,
                groupIds: entry.ledgerAccount?.groups.map(group => group.groupId) ?? [],
            }))

            return ledgerTransactionAuth.read.dynamicFields({ accounts })
        },
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
        authorizer: async ({ params, prisma }) => ledgerTransactionAuth.readPage.dynamicFields({
            accounts: [await resolveAccountOwnership(prisma, { ledgerAccountId: params.paging.details.accountId })],
        }),
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
        authorizer: () => ledgerTransactionAuth.advance.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        operation: async ({ prisma, params }) => {
            // advance recomputes the whole transaction, which can span two unrelated parties
            // (e.g. a purchase debits the buyer and credits a shop group). Every call below is
            // bypassed for that reason: an ownership check would reject whichever side isn't
            // the actual caller.
            let transaction: ExpandedLedgerTransaction = await ledgerTransactionOperations.read({
                params: { id: params.id },
                bypassAuth: true,
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

                try {
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
                } catch (err) {
                    // A P2025 here means the transaction left PENDING concurrently, e.g. a
                    // racing duplicate call to advance. The final read below returns whatever
                    // state it actually settled into, so there is nothing more to do here.
                    if (!(err instanceof PrismaClientKnownRequestError) || err.code !== 'P2025') {
                        throw err
                    }

                    logger.error(`Ledger transaction ${params.id} left the PENDING state before fees could be updated.`)
                }
            }

            const balances = await ledgerAccountOperations.calculateBalances({
                params: {
                    ledgerAccountIds: transaction.ledgerEntries.map(entry => entry.ledgerAccountId),
                    atTransactionId: transaction.id,
                },
                bypassAuth: true,
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
                bypassAuth: true,
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
        // A transaction with no debit entries at all (e.g. a deposit, where the debit side is an
        // external payment, not a ledger entry) has nothing for rule 1 to check, so LEDGER_USE
        // alone is sufficient for it.
        authorizer: async ({ params, prisma }) => {
            const ledgerUse = ledgerTransactionAuth.create.ledgerUse.dynamicFields({})

            const debitLedgerAccountIds = params.ledgerEntries
                .filter(entry => entry.funds < 0)
                .map(entry => entry.ledgerAccountId)

            if (debitLedgerAccountIds.length === 0) {
                return ledgerUse
            }

            const accountAccess = ledgerTransactionAuth.create.accountAccess.dynamicFields({
                accounts: await resolveAccountsOwnership(prisma, { ledgerAccountIds: debitLedgerAccountIds }),
            })

            return andAuthorizers(ledgerUse, accountAccess)
        },
        paramsSchema: z.object({
            purpose: z.nativeEnum(LedgerTransactionPurpose),
            ledgerEntries: z.object({
                funds: z.number(),
                fees: z.number().optional(),
                ledgerAccountId: z.number(),
            }).array(),
            paymentId: z.number().optional(),
            description: z.string().optional(),
        }),
        operation: async ({ prisma, params }) => {
            // Calculate the balance for all accounts which are going to be deducted.
            const debitEntries = params.ledgerEntries.filter(entry => entry.funds < 0)
            // calculateBalances rejects an empty filter, so skip it when there are no debit
            // entries, as with deposits.
            const balances = debitEntries.length > 0
                ? await ledgerAccountOperations.calculateBalances({
                    params: { ledgerAccountIds: debitEntries.map(entry => entry.ledgerAccountId) },
                })
                : {}

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
                fees: entry.fees ?? fees[entry.ledgerAccountId] ?? null
            }))

            const { id } = await prisma.ledgerTransaction.create({
                data: {
                    purpose: params.purpose,
                    state: 'PENDING',
                    ledgerEntries: {
                        create: entries,
                    },
                    paymentId: params.paymentId,
                    description: params.description,
                },
                select: {
                    id: true,
                },
            })

            const transaction: ExpandedLedgerTransaction = await ledgerTransactionOperations.advance({
                params: {
                    id,
                },
                bypassAuth: true,
            })

            if (transaction.state === 'FAILED') {
                // TODO: Better error message.
                throw new ServerError('BAD PARAMETERS', transaction.reason ?? 'Transaksjonen feilet av ukjent årsak.')
            }

            return transaction
        }
    }),
}
