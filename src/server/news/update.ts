import 'server-only'
import prisma from '@/prisma'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import type { SimpleNewsArticle } from '@/server/news/Types'
import type { ActionReturn } from '@/actions/Types'
import { Prisma } from '@prisma/client'

export async function updateNews(
    id: number,
    data: Pick<Prisma.NewsArticleUpdateInput, 'description' | 'endDateTime'> & { name: string }
): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    try {
        const news = await prisma.newsArticle.update({
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
        })
        return {
            success: true,
            data: news
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}