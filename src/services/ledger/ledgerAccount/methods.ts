import { LedgerAccountSchemas } from './schemas'
import { RequireNothing } from '@/auth/auther/RequireNothing'
import { ServiceMethod } from '@/services/ServiceMethod'
import { ServerError } from '@/services/error'
import { z } from 'zod'
import type { Prisma } from '@prisma/client'

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
     * Calculates the balance of an account.
     *
     * @param params.id The ID of the account to calculate the balance for.
     *
     * @returns The balance of the account.
     */
    export const calculateBalance = ServiceMethod({
        auther: () => RequireNothing.staticFields({}).dynamicFields({}), // TODO: Add proper auther
        paramsSchema: z.object({
            id: z.number(),
        }),
        method: async ({ prisma, params }) => {
            // Since we can't know if the account exists from the aggregate queries, we need to check it manually first.
            const accountExists = await prisma.ledgerAccount.count({
                where: {
                    id: params.id,
                },
            })

            if (!accountExists) {
                throw new ServerError('NOT FOUND', 'Kontoen eksisterer ikke.')
            }

            const sumTransactions = async (where: Partial<Prisma.TransactionWhereInput>) => {
                const result = await prisma.transaction.aggregate({
                    _sum: {
                        amount: true,
                        fee: true,
                    },
                    where: {
                        ...where,
                        status: 'SUCCEEDED',
                    },
                })
                return {
                    total: result._sum.amount ?? 0,
                    fees: result._sum.fee ?? 0,
                }
            }

            const [sumIn, sumOut] = await Promise.all([
                sumTransactions({ toAccountId: params.id }),
                sumTransactions({ fromAccountId: params.id }),
            ])

            return {
                total: sumIn.total - sumOut.total,
                fees: sumIn.fees - sumOut.fees,
            }
        }
    })
}
