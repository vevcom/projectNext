import 'server-only'
import { defaultNewsArticleOldCutoff, newsArticleRealtionsIncluder } from './ConfigVars'
import prisma from '@/prisma'
import { readCurrenOmegaOrder } from '@/server/omegaOrder/read'
import { createArticle } from '@/server/cms/articles/create'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedNewsArticle } from './Types'

/**
 * A function that creates a news article, it also creates a corresponding article in the CMS to
 * relate to the news article. The news will be linked to currentOmegaOrder
 * @param config.endDateTime - The date and time the news article will be removed from the website.
 * endDateTime is optional, if not provided it will be set to the current date + defaultNewsArticleOldCutoff
 * @param config.description - The description of the news article
 * @param config.name - The name of the news article (and article)
 * @returns
 */
export async function createNews({
    endDateTime,
    description,
    name,
}: {
    endDateTime?: Date | null,
    description: string,
    name: string,
}): Promise<ActionReturn<ExpandedNewsArticle>> {
    if (!endDateTime) {
        endDateTime = new Date()
        endDateTime.setDate(endDateTime.getDate() + defaultNewsArticleOldCutoff)
    }

    const res = await readCurrenOmegaOrder()
    if (!res.success) return res
    const currentOrder = res.data

    try {
        const article = await createArticle(name)
        if (!article.success) {
            return article
        }
        const news = await prisma.newsArticle.create({
            data: {
                description,
                article: {
                    connect: {
                        id: article.data.id
                    }
                },
                endDateTime,
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
