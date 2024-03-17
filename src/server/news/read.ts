import 'server-only'
import { newsArticleRealtionsIncluder, simpleNewsArticleRealtionsIncluder } from '@/server/news/ConfigVars'
import prisma from '@/prisma'
import type { ExpandedNewsArticle, SimpleNewsArticle } from '@/server/news/Types'
import type { ReadPageInput } from '@/actions/Types'
import { prismaCall } from '../prismaCall'
import { ServerError } from '../error'

export async function readOldNewsPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<SimpleNewsArticle[]> {
    const news = await prismaCall(() => prisma.newsArticle.findMany({
        where: {
            endDateTime: {
                lt: new Date(),
            }
        },
        skip: page.page * page.pageSize,
        take: page.pageSize,
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
