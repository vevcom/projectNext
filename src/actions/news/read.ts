'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ExpandedNewsArticle, SimpleNewsArticle } from './Types'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'

export async function readOldNewsPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<ActionReturn<SimpleNewsArticle[]>> {
    try {
        const news = await prisma.newsArticle.findMany({
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
            include: {
                article: {
                    include: {
                        coverImage: {
                            include: {
                                image: true
                            }
                        }
                    }
                }
            }
        })
        return {
            success: true,
            data: news.map(n => ({
                ...n,
                coverImage: n.article.coverImage.image
            })),
        }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function readNewsCurrent(): Promise<ActionReturn<SimpleNewsArticle[]>> {
    try {
        const news = await prisma.newsArticle.findMany({
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
            include: {
                article: {
                    include: {
                        coverImage: {
                            include: {
                                image: true
                            }
                        }
                    }
                }
            }
        })
        return {
            success: true,
            data: news.map(n => ({
                ...n,
                coverImage: n.article.coverImage.image
            }))
        }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function readNewsByIdOrName(idOrName: number | {
    articleName: string
    order: number
}): Promise<ActionReturn<ExpandedNewsArticle>> {
    try {
        const news = await prisma.newsArticle.findUnique({
            where: typeof idOrName === 'number' ? {
                id: idOrName
            } : {
                articleName_orderPublished: {
                    articleName: idOrName.articleName,
                    orderPublished: idOrName.order
                }
            },
            include: {
                article: {
                    include: {
                        coverImage: true,
                        articleSections: {
                            include: {
                                cmsImage: true,
                                cmsParagraph: true,
                                cmsLink: true
                            }
                        }
                    }
                }
            }
        })
        if (!news) return { success: false, error: [{ message: `article ${idOrName} not found` }] }
        return { success: true, data: news }
    } catch (error) {
        return errorHandler(error)
    }
}
