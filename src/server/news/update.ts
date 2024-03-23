import 'server-only'
import { updateNewsArticleValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { UpdateNewsArticleTypes } from './validation'
import type { SimpleNewsArticle } from '@/server/news/Types'

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
