import 'server-only'
import { prismaCall } from '@/services/prismaCall'
import { destroyArticle } from '@/services/cms/articles/destroy'
import prisma from '@/prisma'
import type { SimpleNewsArticle } from '@/services/news/Types'

/**
 * Yhis function destroys a newsArticle. It is also responsible for sleaning up the article,
 * to avoid orphaned articles. It calls destroyArticle to destroy the article and its coverImage (cmsImage)
 * @param id - id of news article to destroy
 * @returns
 */
export async function destroyNews(id: number): Promise<Omit<SimpleNewsArticle, 'coverImage'>> {
    const news = await prismaCall(() => prisma.newsArticle.delete({
        where: {
            id
        }
    }))
    await destroyArticle(news.articleId) //This function also destoys cover cms image
    return news
}
