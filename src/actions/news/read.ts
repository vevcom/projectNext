'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ReturnType, SimpleReturnType } from './ReturnType'
import type { ActionReturn } from '@/actions/type'

export async function readNews(): Promise<ActionReturn<SimpleReturnType[]>> {
    try {
        const news = await prisma.newsArticle.findMany({
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
        if (!news) return { success: false, error: [{message: `article ${idOrName} not found`}] }
        return { success: true, data: news }
    } catch (error) {
        return errorHandler(error)
    }
}