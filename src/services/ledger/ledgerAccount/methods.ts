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

            if (account) {
                return account
            }

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
                            ledgerTransaction: { status: 'SUCCEEDED' },
                        },
                        {
                            // If the amount is less than zero the entry is a debit (i.e. taking money).
                            amount: { lt: 0 },
                            // The amount should be deducted from the source if the transaction succeeded (obviously)
                            // OR when the transaction is pending. This is our way of reserving the funds
                            // until the transaction is complete.
                            ledgerTransaction: { status: { in: ['PENDING', 'SUCCEEDED'] } },
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
            const balanceRecord = Object.fromEntries(
                balanceArray.map(balance => [
                    balance.ledgerAccountId, 
                    {
                        amount: balance._sum.amount ?? 0,
                        fees: balance._sum.fees ?? 0 
                    }
                ])
            )

            return balanceRecord

            // // The output from the Prisma `groupBy` method is an array.
            // // We convert it to an object (record) as it is more sensible for lookups. 
            // const balanceRecord = Object.fromEntries(
            //     // The "as const"s are required so that TS understands that the arrays
            //     // have a length of exactly two.
            //     [
            //         // Set all ids to zero by default in case some ledger accounts do not have
            //         // any ledger entries yet.
            //         ...params.ids.map(id => [id, { amount: 0, fees: 0 }] as const),
            //         // Map the array returned by `groupBy` to key value pairs. 
            //         ...balanceArray.map(balance => [
            //             // The "!" is required because the typing for `fromEntries` doesn't accept
            //             // null as a key. (Even though all keys just get converted to strings during
            //             // runtime.) The query above guarantees that the id can never be null so
            //             // its safe anyhow. 
            //             balance.ledgerAccountId!, 
            //             {
            //                 // Prisma sets sum to "null" in case the only rows which exist are null.
            //                 // For our case we can treat it as zero.
            //                 amount: balance._sum.amount ?? 0,
            //                 fees: balance._sum.fees ?? 0,  
            //             },
            //         ] as const),
            //     ]
            // )

            // The object returned by `fromEntries` assumes that all keys map to the provided type.
            // This is obviously not true so we need to assert the record as partial.
            // return balanceRecord as Partial<typeof balanceRecord>
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

            // We know that the returned balances must contain the id we provided.
            // So, we can simply assert that this is not undefined.
            // TODO: There might be a better way to do this?
            // return balances[params.id]!
        }
    })

            // const sumPayments = async () => {
            //     const payments = await prisma.payment.aggregate({
            //         where: {
            //             transaction: {
            //                 id: params.atTransactionId && { lte: params.atTransactionId },
            //                 toAccountId: params.id,
            //                 status: 'SUCCEEDED',
            //             }
            //         },
            //         _sum: {
            //             amount: true,
            //             fees: true,
            //         },
            //     })

            //     return {
            //         amount: payments._sum.amount ?? 0,
            //         fees: payments._sum.fees ?? 0,
            //     }
            // }

            // const sumTransfers = async (direction: 'TO' | 'FROM', accountId: number) => {
            //     const transactionFilter = {
            //         id: params.atTransactionId && { lte: params.atTransactionId },
            //         fromAccountId: direction === 'FROM' ? accountId : undefined,
            //         toAccountId: direction === 'TO' ? accountId : undefined,
            //         // Reserve transfers that are pending (i.e. don't count them towards the balance), 
            //         // but don't make them available at the destination account
            //         status: direction === 'TO' ? 'SUCCEEDED' : { in: ['SUCCEEDED', 'PENDING'] },
            //     } satisfies Prisma.TransactionWhereInput

            //     const transfers = await prisma.transfer.aggregate({
            //         where: {
            //             transaction: transactionFilter,
            //         },
            //         _sum: {
            //             amount: true,
            //             fees: true,
            //         },
            //     })

            //     return {
            //         amount: transfers._sum.amount ?? 0,
            //         fees: transfers._sum.fees ?? 0,
            //     }
            // }

            // const [payments, transfersIn, transfersOut] = await Promise.all([
            //     sumPayments(),
            //     sumTransfers('TO', params.id),
            //     sumTransfers('FROM', params.id),
            // ])

        //     return {
        //         amount: payments.amount + transfersIn.amount - transfersOut.amount,
        //         fees: payments.fees + transfersIn.fees - transfersOut.fees,
        //     }
        // }
    // })
}
