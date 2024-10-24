import 'server-only'
import { defaultNewsArticleOldCutoff, newsArticleRealtionsIncluder } from './ConfigVars'
import { createNewsArticleValidation } from './validation'
import { Articles } from '@/cms/articles'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { createArticle } from '@/services/cms/articles/create'
import type { CreateNewsArticleTypes } from './validation'
import type { ExpandedNewsArticle } from './Types'

/**
 * A function that creates a news article, it also creates a corresponding article in the CMS to
 * relate to the news article. The news will be linked to currentOmegaOrder
 * @param rawdata.endDateTime - The date and time the news article will be removed from the website.
 * endDateTime is optional, if not provided it will be set to the current date + defaultNewsArticleOldCutoff
 * @param rawdata.description - The description of the news article
 * @param rawdata.name - The name of the news article (and article)
 * @returns
 */
export async function createNews(rawdata: CreateNewsArticleTypes['Detailed']): Promise<ExpandedNewsArticle<true>> {
    const { name, description, endDateTime } = createNewsArticleValidation.detailedValidate(rawdata)

    const backupEndDateTime = new Date()
    backupEndDateTime.setDate(backupEndDateTime.getDate() + defaultNewsArticleOldCutoff)

    const currentOrder = await readCurrentOmegaOrder()

    const article = await createArticle({ name })

    const news = await prismaCall(() => prisma.newsArticle.create({
        data: {
            description,
            article: {
                connect: {
                    id: article.id
                }
            },
            endDateTime: endDateTime || backupEndDateTime,
            omegaOrder: {
                connect: currentOrder,
            }
        },
        include: newsArticleRealtionsIncluder,
    }))
    return {
        ...news,
        article: await Articles.validateAndCollapseCmsLinksInArticle.client(prisma).execute({
            params: news.article, session: null
        })
    }
}
