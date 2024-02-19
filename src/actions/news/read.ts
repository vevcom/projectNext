'use server'
import { currentVsOldCutOff, maxCurrentNews } from './ConfigVars'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ReturnType, SimpleReturnType } from './ReturnType'
import type { ActionReturn, ReadPageInput } from '@/actions/type'

function getCutoff() {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - currentVsOldCutOff)
    return oneWeekAgo
}

export async function readNewsPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<ActionReturn<SimpleReturnType[]>> {
    try {
        const oneWeekAgo = getCutoff()

        const news = await prisma.newsArticle.findMany({
            where: {
                article: {
                    createdAt: {
                        lt: oneWeekAgo,
                    },
                }
            },
            skip: maxCurrentNews + page.page * page.pageSize,
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

export async function readNewsCurrent(): Promise<ActionReturn<SimpleReturnType[]>> {
    try {
        const oneWeekAgo = getCutoff()

        const news = await prisma.newsArticle.findMany({
            where: {
                article: {
                    createdAt: {
                        gte: oneWeekAgo,
                    },
                },
            },
            take: maxCurrentNews,
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

export async function readNewsByIdOrName(idOrName: number | string): Promise<ActionReturn<ReturnType>> {
    try {
        const news = await prisma.newsArticle.findUnique({
            where: typeof idOrName === 'number' ? {
                id: idOrName
            } : {
                articleName: idOrName
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
