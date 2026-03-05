import '@pn-server-only'
import { newsSchemas } from './schemas'
import { defaultNewsArticleOldCutoff, newsArticleRealtionsIncluder, simpleNewsArticleRealtionsIncluder } from './constants'
import { newsAuth } from './auth'
import { articleOperations } from '@/cms/articles/operations'
import { defineOperation } from '@/services/serviceOperation'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { ServerError } from '@/services/error'
import { implementUpdateArticleOperations } from '@/cms/articles/implement'
import { z } from 'zod'

const read = defineOperation({
    authorizer: () => newsAuth.read.dynamicFields({}),
    paramsSchema: z.object({
        id: z.number()
    }),
    operation: async ({ prisma, params }) => {
        const news = await prisma.newsArticle.findUnique({
            where: {
                id: params.id
            },
            include: newsArticleRealtionsIncluder
        })
        if (!news) throw new ServerError('NOT FOUND', `article ${params.id} not found`)
        return news
    }
})

export const newsOperations = {
    create: defineOperation({
        authorizer: () => newsAuth.create.dynamicFields({}),
        dataSchema: newsSchemas.create,
        operation: async ({ prisma, data }) => {
            const { name, description, endDateTime } = data

            const backupEndDateTime = new Date()
            backupEndDateTime.setDate(backupEndDateTime.getDate() + defaultNewsArticleOldCutoff)

            const article = await articleOperations.create.internalCall({ data: { name } })

            const news = await prisma.newsArticle.create({
                data: {
                    description,
                    article: {
                        connect: {
                            id: article.id
                        }
                    },
                    endDateTime: endDateTime || backupEndDateTime,
                },
                include: newsArticleRealtionsIncluder,
            })
            return news
        }
    }),
    destroy: defineOperation({
        authorizer: () => newsAuth.destroy.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number()
        }),
        operation: async ({ prisma, params }) => {
            const news = await prisma.newsArticle.delete({
                where: { id: params.id },
            })
            await articleOperations.destroy.internalCall({ params: { articleId: news.articleId } })
        }
    }),
    readCurrent: defineOperation({
        authorizer: () => newsAuth.readCurrent.dynamicFields({}),
        operation: async ({ prisma }) => {
            const news = await prisma.newsArticle.findMany({
                where: {
                    endDateTime: {
                        gte: new Date(),
                    }
                },
                orderBy: {
                    article: {
                        createdAt: 'desc',
                    },
                },
                include: simpleNewsArticleRealtionsIncluder,
            })
            return news.map(newsItem => ({
                ...newsItem,
                coverImage: newsItem.article.coverImage.image
            }))
        }
    }),
    readOldPage: defineOperation({
        paramsSchema: readPageInputSchemaObject(
            z.number(),
            z.object({
                id: z.number(),
            }),
            z.undefined()
        ), // Converted from ReadPageInput<number, EventArchiveCursor, EventArchiveDetails>
        authorizer: () => newsAuth.readOldPage.dynamicFields({}),
        operation: async ({ prisma, params }) => {
            const news = await prisma.newsArticle.findMany({
                where: {
                    endDateTime: {
                        lt: new Date(),
                    }
                },
                ...cursorPageingSelection(params.paging.page),
                orderBy: {
                    article: {
                        createdAt: 'desc',
                    }
                },
                include: simpleNewsArticleRealtionsIncluder
            })
            return news.map(newsItem => ({
                ...newsItem,
                coverImage: newsItem.article.coverImage.image
            }))
        }
    }),
    read,
    update: defineOperation({
        authorizer: () => newsAuth.update.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: newsSchemas.update,
        operation: async ({ prisma, params, data }) =>
            prisma.newsArticle.update({
                where: { id: params.id },
                data: {
                    description: data.description,
                    article: {
                        update: {
                            name: data.name
                        }
                    },
                    endDateTime: data.endDateTime || undefined,
                }
            })
    }),
    updateArticle: implementUpdateArticleOperations({
        implementationParamsSchema: z.object({
            newsId: z.number(),
        }),
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        authorizer: ({ implementationParams }) => newsAuth.updateArticle.dynamicFields({}),
        ownedArticles: async ({ implementationParams }) => {
            const news = await read({ params: { id: implementationParams.newsId }, bypassAuth: true })
            return [news.article]
        }
    })
} as const
