'use server'
import { destroyArticle } from '@/server/cms/articles/destroy'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { SimpleNewsArticle } from '@/server/news/Types'

export async function destroyNews(id: number): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    try {
        // destroying an news article also destroys the cover image, and all cms parts!
        // Musy destroy the article as that will destoy everything
        const news = await prisma.newsArticle.findUnique({
            where: { id }
        })
        if (!news) {
            return createActionError('NOT FOUND', `News ${id} not found`)
        }
        const res = await destroyArticle(news.articleId)
        if (!res.success) {
            return res
        }

        return {
            success: true,
            data: news
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
