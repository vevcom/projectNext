import 'server-only'
import { articleRealtionsIncluder } from './ConfigVars'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ExpandedArticle } from './Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * A function to create a new article. It will have no content (sections) and cover image will relate
 * to null. A category can be given to the article, but it is not required.
 * @param name - The name of the article to create. If null, a unique name will be generated.
 * @param config - { categoryId } The category to connect the article to
 * @returns 
 */
export async function createArticle(name: string | null, config?: {
    categoryId: number,
}): Promise<ActionReturn<ExpandedArticle>> {
    try {
        // if name not given, create a unique new name
        if (name === null) {
            let i = 1
            name = 'Ny artikkel'
            while (await prisma.article.findFirst({ where: { name } })) {
                name = `Ny artikkel ${i++}`
            }
        }


        const article = await prisma.article.create({
            data: {
                name,
                coverImage: {
                    create: {}
                },
                articleCategory: config ? {
                    connect: {
                        id: config.categoryId
                    }
                } : undefined
            },
            include: articleRealtionsIncluder,
        })
        return { success: true, data: article }
    } catch (error) {
        return createPrismaActionError(error)
    }
}