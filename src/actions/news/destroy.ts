'use server'
import { destroyArticle } from '@/cms/articles/destroy'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn } from '@/actions/Types'
import type { SimpleNewsArticle } from './Types'

export async function destroyNews(id: number): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    try {
        // destroying an news article also destroys the cover image, and all cms parts!
        // Musy destroy the article as that will destoy everything
        const news = await prisma.newsArticle.findUnique({
            where: { id }
        })
        if (!news) {
            return { success: false, error: [{ message: `News ${id} not found` }] }
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
        return errorHandler(error)
    }
}
