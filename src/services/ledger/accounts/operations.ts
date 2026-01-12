import { ledgerAccountSchemas } from './schemas'
import { ServerError } from '@/services/error'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { defineOperation } from '@/services/serviceOperation'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'
import { z } from 'zod'
import { LedgerAccountType } from '@prisma/client'
import type { LedgerAccount } from '@prisma/client'
import type { Balance, BalanceRecord } from './types'

export const ledgerAccountOperations = {
    /**
     * Creates a new ledger account for given user or group.
     *
     * Will throw an error if both `userId` and `groupId` are set, or if neither are set.
     *
     * @param data.userId The ID of the user to create the account for.
     * @param data.groupId The ID of the group to create the account for.
     *
     * @returns The created account.
     */
    create: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        dataSchema: ledgerAccountSchemas.create,
        operation: async ({ prisma, data }): Promise<LedgerAccount> => {
            const type = data.userId === undefined ? 'GROUP' : 'USER'

            if (data.userId === undefined && data.groupId === undefined) {
                throw new ServerError('BAD PARAMETERS', 'Enten bruker-id eller gruppe-id må være spesifisert.')
            }

            if (data.userId !== undefined && data.groupId !== undefined) {
                throw new ServerError('BAD PARAMETERS', 'Både bruker-id og gruppe-id kan ikke være spesifisert samtidig.')
            }

            return prisma.ledgerAccount.create({
                data: {
                    userId: data.userId,
                    groupId: data.groupId,
                    payoutAccountNumber: data.payoutAccountNumber,
                    frozen: data.frozen,
                    type,
                }
            })
        },
    }),

    /**
     * Reads details of a ledger account by ledger account id, user id, or group id.
     * If searching by userId/groupId the account will be created if it does not exist.
     *
     * **Note**: The balance of an account is not included in the response.
     * Use the `calculateBalance` method to get the balance.
     *
     * @param params.userId The ID of the user to read the account for.
     * @param params.groupId The ID of the group to read the account for.
     * @param params.ledgerAccountId The ID of the ledger account to read.
     *
     * @returns The account details.
     */
    read: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.union([
            z.object({
                userId: z.number(),
                groupId: z.undefined(),
                ledgerAccountId: z.undefined(),
            }),
            z.object({
                groupId: z.number(),
                userId: z.undefined(),
                ledgerAccountId: z.undefined(),
            }),
            z.object({
                groupId: z.undefined(),
                userId: z.undefined(),
                ledgerAccountId: z.number(),
            }),
        ]),
        operation: async ({ prisma, session, params }): Promise<LedgerAccount> => {
            // If searching by ledger account id we don't want to create a new account if it doesn't exist.
            if (params.ledgerAccountId !== undefined) {
                return await prisma.ledgerAccount.findUniqueOrThrow({
                    where: {
                        id: params.ledgerAccountId,
                    },
                })
            }

            // If searching by userId/groupId we want to create the account if it doesn't exist.
            // TODO: Is this something we want?

            const account = await prisma.ledgerAccount.findUnique({
                where: {
                    userId: params.userId,
                    groupId: params.groupId,
                },
            })

            if (account) return account

            return ledgerAccountOperations.create({ session, data: params })
        },
    }),

    readPage: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.object({
                accountType: z.nativeEnum(LedgerAccountType).optional(),
            }),
        ),
        operation: async ({ params: { paging }, prisma }) =>
            // TODO: Add balance to each account
            await prisma.ledgerAccount.findMany({
                where: {
                    type: paging.details.accountType,
                },
                orderBy: [
                    { createdAt: 'desc' },
                    { id: 'desc' },
                ],
                ...cursorPageingSelection(paging.page),
            })

    }),

    /**
     * Updates a ledger account with the given data.
     *
     * @param params.id The ID of the account to update.
     * @param data The data to update the account with.
     *
     * @returns The updated account.
     */
    update: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: ledgerAccountSchemas.update,
        operation: async ({ prisma, params, data }) => prisma.ledgerAccount.update({
            where: {
                id: params.id,
            },
            data,
        })
    }),

    /**
     * Calculates the balance and fees of a ledger account.
     * Optionally takes a transaction ID to calculate the balance up until that transaction.
     *
     * @warning Non-existent accounts will be treated as having a balance of zero.
     *
     * @param params.ids The IDs of the accounts to calculate the balance for.
     * @param params.atTransactionId Optional transaction ID to calculate the balance up until that transaction.
     *
     * @returns The balances of the ledger accounts.
     */
    calculateBalances: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            ids: z.number().array(),
            atTransactionId: z.number().optional(),
        }),
        operation: async ({ prisma, params }): Promise<BalanceRecord> => {
            const balanceArray = await prisma.ledgerEntry.groupBy({
                by: ['ledgerAccountId'],
                where: {
                    // Select which accounts we want to calculate the balance for
                    ledgerAccountId: {
                        in: params.ids,
                    },
                    // Since transaction ids are sequential we can use the less than operator
                    // to filter for all the transactions that happened before the given one.
                    // This is useful in case we need to know the balance in the past.
                    ledgerTransactionId: {
                        lte: params.atTransactionId,
                    },
                    // Credit and debit ledger entries are valid under slight different conditions.
                    OR: [
                        {
                            // If the amount is greater than zero the entry is a credit (i.e. giving money).
                            funds: { gt: 0 },
                            // The receiver should (logically) only receive the money if the transaction succeeded.
                            ledgerTransaction: { state: 'SUCCEEDED' },
                        },
                        {
                            // If the amount is less than zero the entry is a debit (i.e. taking money).
                            funds: { lt: 0 },
                            // The amount should be deducted from the source if the transaction succeeded (obviously)
                            // OR when the transaction is pending. This is our way of reserving the funds
                            // until the transaction is complete.
                            ledgerTransaction: { state: { in: ['PENDING', 'SUCCEEDED'] } },
                        },
                    ],
                },
                // Select what fields we should sum
                _sum: {
                    funds: true,
                    fees: true,
                },
            })

            // Convert the array to an object as it's more convenient for lookups and
            // replace all nulls with zeros to handle accounts with no entries yet.
            // Set the balance of accounts that have no entries to zero.
            const balanceRecord = Object.fromEntries([
                ...params.ids.map(id => [id, { amount: 0, fees: 0 }]),
                ...balanceArray.map(balance => [
                    balance.ledgerAccountId,
                    {
                        amount: balance._sum.funds ?? 0,
                        fees: balance._sum.fees ?? 0
                    }
                ])
            ])

            return balanceRecord
        }
    }),

    /**
     * Calcultates the balance of a single account. Under the hood it simply uses `calculateBalances`.
     *
     * @warning In case a ledger account with the provided id doesn't exist a balance of zero will be returned!
     *
     * @param params.id The ID of the account to calculate the balance for.
     * @param params.atTransactionId Optional transaction ID to calculate the balance up until that transaction.
     *
     * @returns The balances of the ledger accounts.
     */
    calculateBalance: defineOperation({
        authorizer: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            id: z.number(),
            atTransactionId: z.number().optional(),
        }),
        operation: async ({ params }): Promise<Balance> => {
            const balances = await ledgerAccountOperations.calculateBalances({
                params: {
                    ids: [params.id],
                    atTransactionId: params.atTransactionId,
                },
            })

            return balances[params.id]
        }
    }),
}
