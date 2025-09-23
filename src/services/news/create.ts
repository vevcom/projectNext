import '@pn-server-only'
import { defaultNewsArticleOldCutoff, newsArticleRealtionsIncluder } from './ConfigVars'
import { createNewsArticleValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import { readCurrentOmegaOrder } from '@/services/omegaOrder/read'
import { createArticle } from '@/services/cms/articles/create'
import { createVisibility } from '@/services/visibility/create'
import type { CreateNewsArticleTypes } from './validation'
import type { ExpandedNewsArticle } from './Types'

/**
 * A function that creates a news article, it also creates a corresponding article in the CMS to
 * relate to the news article. The news will be linked to currentOmegaOrder and will be created
 * in draft mode (unpublished) by default.
 * @param rawdata.endDateTime - The date and time the news article will be removed from the website.
 * endDateTime is optional, if not provided it will be set to the current date + defaultNewsArticleOldCutoff
 * @param rawdata.description - The description of the news article
 * @param rawdata.name - The name of the news article (and article)
 * @returns
 */
export async function createNews(rawdata: CreateNewsArticleTypes['Detailed']): Promise<ExpandedNewsArticle> {
    const { name, description, endDateTime } = createNewsArticleValidation.detailedValidate(rawdata)

    const backupEndDateTime = new Date()
    backupEndDateTime.setDate(backupEndDateTime.getDate() + defaultNewsArticleOldCutoff)

    const currentOrder = await readCurrentOmegaOrder()

    const article = await createArticle({ name })

    // Create visibility for the news article (defaults to unpublished/draft)
    const visibility = await createVisibility('NEWS_ARTICLE', {
        admin: [],
        regular: []
    })

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
            },
            visibility: {
                connect: {
                    id: visibility.id
                }
            }
        },
        include: newsArticleRealtionsIncluder,
    }))
    return news
}
