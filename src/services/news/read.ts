import '@pn-server-only'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { newsArticleRealtionsIncluder, simpleNewsArticleRealtionsIncluder } from '@/services/news/ConfigVars'
import { prisma } from '@/prisma/client'
import type { ExpandedNewsArticle, NewsCursor, SimpleNewsArticle } from '@/services/news/types'
import type { ReadPageInput } from '@/lib/paging/types'

export async function readOldNewsPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize, NewsCursor>
): Promise<SimpleNewsArticle[]> {
    const news = await prismaCall(() => prisma.newsArticle.findMany({
        where: {
            endDateTime: {
                lt: new Date(),
            }
        },
        ...cursorPageingSelection(page),
        orderBy: {
            article: {
                createdAt: 'desc',
            }
        },
        include: simpleNewsArticleRealtionsIncluder
    }))
    return news.map(newsItem => ({
        ...newsItem,
        coverImage: newsItem.article.coverImage.image
    }))
}

export async function readNewsCurrent(): Promise<SimpleNewsArticle[]> {
    const news = await prismaCall(() => prisma.newsArticle.findMany({
        where: {
            endDateTime: {
                gte: new Date(),
            }
        },
        orderBy: {
            article: {
                createdAt: 'desc',
            },
        },
        include: simpleNewsArticleRealtionsIncluder,
    }))
    return news.map(newsItem => ({
        ...newsItem,
        coverImage: newsItem.article.coverImage.image
    }))
}

export async function readNews(idOrName: number | {
    articleName: string
    order: number
}): Promise<ExpandedNewsArticle> {
    const news = await prismaCall(() => prisma.newsArticle.findUnique({
        where: typeof idOrName === 'number' ? {
            id: idOrName
        } : {
            articleName_orderPublished: {
                articleName: idOrName.articleName,
                orderPublished: idOrName.order
            }
        },
        include: newsArticleRealtionsIncluder
    }))
    if (!news) throw new ServerError('NOT FOUND', `article ${idOrName} not found`)
    return news
}
