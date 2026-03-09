import { omegaQuotesAuth } from './auth'
import { omegaquoteSchemas } from './schemas'
import { omegaQuoteFilterSelection } from './constants'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { notificationOperations } from '@/services/notifications/operations'
import { defineOperation } from '@/services/serviceOperation'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { z } from 'zod'

export const omegaquoteOperations = {
    create: defineOperation({
        authorizer: ({ params }) => omegaQuotesAuth.create.dynamicFields({ userId: params.userPosterId }),
        dataSchema: omegaquoteSchemas.create,
        paramsSchema: z.object({
            userPosterId: z.number()
        }),
        operation: async ({ prisma, data, params }) => {
            const results = await prisma.omegaQuote.create({
                data: {
                    ...data,
                    userPoster: {
                        connect: {
                            id: params.userPosterId
                        }
                    }
                }
            })

            notificationOperations.createSpecial.internalCall({
                params: {
                    special: 'NEW_OMEGAQUOTE',
                },
                data: {
                    title: 'Ny Omegaquote♪',
                    message: `${results.quote}\n - ${results.author}`,
                },
            })
            return results
        }
    }),
    readPage: defineOperation({
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.undefined()
        ),
        authorizer: () => omegaQuotesAuth.readPage.dynamicFields({}),
        operation: async ({ prisma, params }) =>
            prisma.omegaQuote.findMany({
                orderBy: {
                    timestamp: 'desc',
                },
                ...cursorPageingSelection(params.paging.page),
                select: omegaQuoteFilterSelection,
            })
    }),
} as const
