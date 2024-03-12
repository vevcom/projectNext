'use server'
import { articleRealtionsIncluder } from './ConfigVars'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ExpandedArticle } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function readArticle(idOrName: number | {
    name: string,
    category: string
}): Promise<ActionReturn<ExpandedArticle>> {
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
            include: articleRealtionsIncluder,
        })
        if (!article) return createActionError('NOT FOUND', `Article ${name} not found`)
        if (!article.coverImage) return createActionError('BAD PARAMETERS', `Article ${name} has no cover image`)
        const ret: ExpandedArticle = {
            ...article,
            coverImage: article.coverImage
        }
        return { success: true, data: ret }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

export async function readArticles(articleCategoryId: number): Promise<ActionReturn<ExpandedArticle[]>> {
    try {
        const articles = await prisma.article.findMany({
            where: {
                articleCategoryId
            },
            include: articleRealtionsIncluder
        })
        return { success: true, data: articles }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
