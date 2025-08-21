import { LedgerAccountSchemas } from './schemas'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { ServiceMethod } from '@/services/ServiceMethod'
import { ServerError } from '@/services/error'
import { z } from 'zod'
import { BalanceRecord } from './Types'

export namespace LedgerAccountMethods {
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
    export const create = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        dataSchema: LedgerAccountSchemas.create,
        method: async ({ prisma, data }) => {
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
                    type,
                }
            })
        },
    })

    /**
     * Reads details of a ledger account for a given user or group.
     * The account will be created if it does not exist.
     *
     * **Note**: The balance of an account is not included in the response.
     * Use the `calculateBalance` method to get the balance.
     *
     * @param params.userId The ID of the user to read the account for.
     * @param params.groupId The ID of the group to read the account for.
     *
     * @returns The account details.
     */
    export const read = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.union([
            z.object({
                userId: z.number(),
                groupId: z.undefined(),
            }),
            z.object({
                groupId: z.number(),
                userId: z.undefined(),
            }),
        ]),
        method: async ({ prisma, session, params }) => {
            const account = await prisma.ledgerAccount.findUnique({
                where: {
                    userId: params.userId,
                    groupId: params.groupId,
                },
            })

            if (account) return account

            return create.client(prisma).execute({ session, data: params })
        },
    })

    /**
     * Calculates the balance and fees of a ledger account. Optionally takes a transaction ID to calculate the balance up until that transaction.
     *
     * @warning Non-existent accounts will be treated as having a balance of zero.
     * 
     * @param params.ids The IDs of the accounts to calculate the balance for.
     * @param params.atTransactionId Optional transaction ID to calculate the balance up until that transaction.
     *
     * @returns The balances of the ledger accounts.
     */
    export const calculateBalances = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            ids: z.number().array(),
            atTransactionId: z.number().optional(),
        }),
        method: async ({ prisma, params }): Promise<BalanceRecord> => {
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
                            amount: { gt: 0 },
                            // The receiver should (logically) only receive the money if the transaction succeeded.
                            ledgerTransaction: { state: 'SUCCEEDED' },
                        },
                        {
                            // If the amount is less than zero the entry is a debit (i.e. taking money).
                            amount: { lt: 0 },
                            // The amount should be deducted from the source if the transaction succeeded (obviously)
                            // OR when the transaction is pending. This is our way of reserving the funds
                            // until the transaction is complete.
                            ledgerTransaction: { state: { in: ['PENDING', 'SUCCEEDED'] } },
                        },
                    ],
                },
                // Select what fields we should sum
                _sum: {
                    amount: true,
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
                        amount: balance._sum.amount ?? 0,
                        fees: balance._sum.fees ?? 0 
                    }
                ])
            ])

            return balanceRecord
        }
    })

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
    export const calculateBalance = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            id: z.number(),
            atTransactionId: z.number().optional(),
        }),
        method: async ({ prisma, session, params }) => {
            const balances = await calculateBalances.client(prisma).execute({
                params: {
                    ids: [params.id],
                    atTransactionId: params.atTransactionId,
                },
                session,
            })

            return balances[params.id]
        }
    })
}
