'use server'
import schema from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn } from '@/actions/Types'
import type { ReturnType } from './ReturnType'

export async function createArticleCategory(
    rawData: FormData
): Promise<ActionReturn<ReturnType>> {
    const parse = schema.safeParse({
        name: rawData.get('name'),
        description: rawData.get('description'),
    })
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
