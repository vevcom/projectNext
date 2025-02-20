import 'server-only'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { newsArticleRealtionsIncluder, simpleNewsArticleRealtionsIncluder } from '@/services/news/ConfigVars'
import prisma from '@/prisma'
import type { ExpandedNewsArticle, NewsCursor, SimpleNewsArticle } from '@/services/news/Types'
import type { ReadPageInput } from '@/lib/paging/Types'

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
    return news.map(n => ({
        ...n,
        coverImage: n.article.coverImage.image
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
    return news.map(n => ({
        ...n,
        coverImage: n.article.coverImage.image
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
