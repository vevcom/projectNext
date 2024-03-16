import 'server-only'
import { articleRealtionsIncluder } from './ConfigVars'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ExpandedArticle } from './Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * A function that reads an article with all the neccessary data included like paragraphs, images, etc...
 * @param idOrName - The id or name + category of the article to read
 * @returns
 */
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
        if (!article) return createActionError('NOT FOUND', `Article ${idOrName} not found`)
        if (!article.coverImage) return createActionError('BAD PARAMETERS', `Article ${idOrName} has no cover image`)
        const ret: ExpandedArticle = {
            ...article,
            coverImage: article.coverImage
        }
        return { success: true, data: ret }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
