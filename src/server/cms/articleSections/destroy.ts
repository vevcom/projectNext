import 'server-only'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ArticleSection } from '@prisma/client'

/**
 * Destroys an article section
 * @param nameOrId - The name or id of the article section to destroy
 * @returns 
 */
export async function destroyArticleSection(nameOrId: string | number): Promise<ActionReturn<ArticleSection>> {
    try {
        const articleSection = await prisma.articleSection.delete({
            where: { 
                name: typeof nameOrId === 'string' ? nameOrId : undefined, 
                id: typeof nameOrId === 'number' ? nameOrId : undefined
            },
        })
        return { success: true, data: articleSection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}