'use server'
import type { ReturnType } from "./ReturnType"
import { ActionReturn } from "@/actions/type"
import prisma from "@/prisma"
import errorHandler from "@/prisma/errorHandler"

export default async function createArticleCategory(
    name: string, 
    description?: string
): Promise<ActionReturn<ReturnType>> {
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