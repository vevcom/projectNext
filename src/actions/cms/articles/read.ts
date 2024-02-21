'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ExpandedArticle } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function readArticle(idOrName: number | {name: string, category: string}): Promise<ActionReturn<ExpandedArticle>> {
    try {
        const article = await prisma.article.findUnique({
            where: typeof idOrName === 'number' ? {
                id: idOrName
            } : {
                articleCategoryName_name: {
                    articleCategoryName: idOrName.category,
                    name: idOrName.name,
                }
            },
            include: {
                articleSections: {
                    include: {
                        cmsImage: true,
                        cmsParagraph: true,
                        cmsLink: true
                    }
                },
                coverImage: true,
            }
        })
        if (!article) return { success: false, error: [{ message: `Article ${name} not found` }] }
        if (!article.coverImage) return { success: false, error: [{ message: `Article ${name} has no cover image` }] }
        const ret: ExpandedArticle = {
            ...article,
            coverImage: article.coverImage
        }
        return { success: true, data: ret }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function readArticles(articleCategoryId: number): Promise<ActionReturn<ExpandedArticle[]>> {
    try {
        const articles = await prisma.article.findMany({
            where: {
                articleCategoryId
            },
            include: {
                articleSections: {
                    include: {
                        cmsImage: true,
                        cmsParagraph: true,
                        cmsLink: true
                    }
                },
                coverImage: true,
            }
        })
        return { success: true, data: articles }
    } catch (error) {
        return errorHandler(error)
    }
}
