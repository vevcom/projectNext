import '@pn-server-only'
import { updateNewsArticleValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { UpdateNewsArticleTypes } from './validation'
import type { SimpleNewsArticle } from '@/services/news/Types'

export async function updateNews(
    id: number,
    rawdata: UpdateNewsArticleTypes['Detailed']
): Promise<Omit<SimpleNewsArticle, 'coverImage'>> {
    const data = updateNewsArticleValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.newsArticle.update({
        where: { id },
        data: {
            description: data.description,
            article: {
                update: {
                    name: data.name
                }
            },
            endDateTime: data.endDateTime || undefined,
        }
    }))
}
