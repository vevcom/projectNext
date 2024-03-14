import 'server-only'
import prisma from '@/prisma'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'
import { Prisma } from '@prisma/client'

export async function updateArticleCategory(
    id: number,
    data: Required<Pick<Prisma.ArticleCategoryUpdateInput, 'name' | 'description'>>
): Promise<ActionReturn<ExpandedArticleCategory>> {
    try {
        const articleCategory = await prisma.articleCategory.update({
            where: {
                id
            },
            data,
            include: {
                articles: true
            }
        })
        return { success: true, data: articleCategory }
    } catch (error) {
        return createPrismaActionError(error)
    }
}