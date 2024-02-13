'use server'
import type { ReturnType } from "./ReturnType"
import { ActionReturn } from "@/actions/type"
import schema from "./schema"
import prisma from "@/prisma"
import errorHandler from "@/prisma/errorHandler"

export async function updateArticleCategoryVisibility(
    id: number, 
    visibility: unknown
): Promise<ActionReturn<ReturnType>> {
    throw new Error('Not implemented')
}

export async function updateArticleCategory(
    id: number,
    rawData: FormData
) : Promise<ActionReturn<ReturnType>> {
    const parse = schema.safeParse({
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