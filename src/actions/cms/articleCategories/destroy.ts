'use server'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'
import type { ActionReturn } from '@/actions/Types'

export async function destroyArticleCategory(id: number): Promise<ActionReturn<ExpandedArticleCategory>> {
    try {
        // TODO: Cheek for visibility type edit of user.

        const articleCategory = await prisma.articleCategory.delete({
            where: {
                id
            },
            include: {
                articles: true
            }
        })
        return { success: true, data: articleCategory }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
