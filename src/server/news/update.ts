import 'server-only'
import { updateNewsArticleValidation } from './schema'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { UpdateNewsArticleType } from './schema'
import type { SimpleNewsArticle } from '@/server/news/Types'

export async function updateNews(
    id: number,
    rawdata: UpdateNewsArticleType
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
