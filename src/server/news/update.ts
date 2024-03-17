import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { Prisma } from '@prisma/client'
import type { SimpleNewsArticle } from '@/server/news/Types'

export async function updateNews(
    id: number,
    data: Pick<Prisma.NewsArticleUpdateInput, 'description' | 'endDateTime'> & { name: string }
): Promise<Omit<SimpleNewsArticle, 'coverImage'>> {
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
