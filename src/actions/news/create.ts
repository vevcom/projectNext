'use server'
import { newsArticleSchema } from './schema'
import { defaultNewsArticleOldCutoff, newsArticleRealtionsIncluder } from './ConfigVars'
import prisma from '@/prisma'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import { createArticle } from '@/server/cms/articles/create'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedNewsArticle } from './Types'
import type { NewsArticleSchemaType } from './schema'

export async function createNews(rawdata: FormData | NewsArticleSchemaType): Promise<ActionReturn<ExpandedNewsArticle>> {
    //TODO: check for can create news permission
    const endDateTime = new Date()
    endDateTime.setDate(endDateTime.getDate() + defaultNewsArticleOldCutoff)

    const parse = newsArticleSchema.safeParse(rawdata)
    if (!parse.success) {
        return createZodActionError(parse)
    }
    const data = parse.data

    const res = await readCurrenOmegaOrder()
    if (!res.success) return res
    const currentOrder = res.data

    try {
        const article = await createArticle(data.name)
        if (!article.success) {
            return article
        }
        const news = await prisma.newsArticle.create({
            data: {
                description: data.description,
                article: {
                    connect: {
                        id: article.data.id
                    }
                },
                endDateTime: data.endDateTime || endDateTime,
                omegaOrder: {
                    connect: currentOrder,
                }
            },
            include: newsArticleRealtionsIncluder,
        })
        return { success: true, data: news }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
