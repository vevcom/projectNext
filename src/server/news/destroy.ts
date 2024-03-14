import 'server-only'
import { destroyArticle } from '@/server/cms/articles/destroy'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { SimpleNewsArticle } from '@/server/news/Types'

/**
 * Yhis function destroys a newsArticle. It is also responsible for sleaning up the article,
 * to avoid orphaned articles. It calls destroyArticle to destroy the article and its coverImage (cmsImage)
 * @param id - id of news article to destroy
 * @returns
 */
export async function destroyNews(id: number): Promise<ActionReturn<Omit<SimpleNewsArticle, 'coverImage'>>> {
    try {
        const news = await prisma.newsArticle.findUnique({
            where: { id }
        })
        if (!news) return createActionError('NOT FOUND', `News ${id} not found`)
        const res = await destroyArticle(news.articleId) //This function also destoys cover cms image
        if (!res.success) return res
        return {
            success: true,
            data: news
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
