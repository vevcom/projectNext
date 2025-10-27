import { defineOperation } from '@/services/serviceOperation'
import { omegaQuotesAuth } from './auth'
import { omegaquoteSchemas } from './schemas'
import { notificationOperations } from '@/services/notifications/operations'
import { z } from 'zod'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { omegaQuoteFilterSelection } from './constants'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'

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

            notificationOperations.createSpecial({
                params: {
                    special: 'NEW_OMEGAQUOTE',
                },
                data: {
                    title: 'Ny Omegaquote♪',
                    message: `${results.quote}\n - ${results.author}`,
                },
                bypassAuth: true,
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
