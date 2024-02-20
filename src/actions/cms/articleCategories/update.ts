'use server'
import articleSchema from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleCategory } from './Types'

export async function updateArticleCategoryVisibility(
    id: number,
    visibility: unknown
): Promise<ActionReturn<ExpandedArticleCategory>> {
    console.log(id, visibility)
    throw new Error('Not implemented')
}

export async function updateArticleCategory(
    id: number,
    rawData: FormData
): Promise<ActionReturn<ExpandedArticleCategory>> {
    const parse = articleSchema.safeParse({
        name: rawData.get('name'),
        description: rawData.get('description'),
    })
    if (!parse.success) {
        return { success: false, error: parse.error.issues }
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
        return errorHandler(error)
    }
}
