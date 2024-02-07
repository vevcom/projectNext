'use server'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'
import type { ReturnType } from './ReturnType'
import type { ActionReturn } from '@/actions/type'

export async function readArticle(idOrName: number | string): Promise<ActionReturn<ReturnType>> {
    try {
        const article = await prisma.article.findUnique({
            where: {
                id: typeof idOrName === 'string' ? undefined : idOrName,
                name: typeof idOrName === 'string' ? idOrName : undefined,
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
        return { success: true, data: article }
    } catch (error) {
        return errorHandeler(error)
    }
}

export async function readArticles(articleCategoryId: number) : Promise<ActionReturn<ReturnType[]>> {
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
        return errorHandeler(error)
    }
}
