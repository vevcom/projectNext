'use server'
import { articleCategorySchema } from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ArticleCategorySchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleCategory } from './Types'

export async function createArticleCategory(
    rawData: FormData | ArticleCategorySchemaType
): Promise<ActionReturn<ExpandedArticleCategory>> {
    const parse = articleCategorySchema.safeParse(rawData)

    if (!parse.success) {
        return { success: false, error: parse.error.issues }
    }

    const { name, description } = parse.data

    try {
        // TODO: Check for permission to create article category
        const articleCategory = await prisma.articleCategory.create({
            data: {
                name,
                description
            },
            include: {
                articles: true
            },
        })
        return { success: true, data: articleCategory }
    } catch (error) {
        return errorHandler(error)
    }
}
