'use server'
import { articleCategorySchema } from './schema'
import prisma from '@/prisma'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import type { ArticleCategorySchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'

export async function updateArticleCategoryVisibility(
    // disable eslint rule temporarily until function is implemented
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visibility: unknown
): Promise<ActionReturn<ExpandedArticleCategory>> {
    throw new Error('Not implemented')
}

export async function updateArticleCategory(
    id: number,
    rawData: FormData | ArticleCategorySchemaType
): Promise<ActionReturn<ExpandedArticleCategory>> {
    const parse = articleCategorySchema.safeParse(rawData)

    if (!parse.success) {
        return createZodActionError(parse)
    }

    const { name, description } = parse.data

    try {
        const articleCategory = await prisma.articleCategory.update({
            where: {
                id
            },
            data: {
                name,
                description
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
