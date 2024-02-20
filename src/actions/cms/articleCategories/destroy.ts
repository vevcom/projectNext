'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ReturnType } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function destroyArticleCategory(id: number): Promise<ActionReturn<ReturnType>> {
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
        return errorHandler(error)
    }
}
