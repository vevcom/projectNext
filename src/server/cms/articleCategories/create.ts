import 'server-only'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleCategory } from './Types'
import { Prisma } from '@prisma/client'

export async function createArticleCategory(
    data: Required<Pick<Prisma.ArticleCategoryCreateInput, 'description' | 'name'>>
): Promise<ActionReturn<ExpandedArticleCategory>> {
    try {
        const articleCategory = await prisma.articleCategory.create({
            data,
            include: {
                articles: true
            },
        })
        return { success: true, data: articleCategory }
    } catch (error) {
        return createPrismaActionError(error)
    }
}