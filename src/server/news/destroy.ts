import 'server-only'
import { destroyArticle } from '@/server/cms/articles/destroy'
import type { SimpleNewsArticle } from '@/server/news/Types'
import { prismaCall } from '../prismaCall'

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
