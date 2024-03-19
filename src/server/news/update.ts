import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { Prisma } from '@prisma/client'
import type { SimpleNewsArticle } from '@/server/news/Types'
import { UpdateNewsArticleType, updateNewsArticleValidation } from './schema'

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
