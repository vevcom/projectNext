'use server'
import prisma from "@/prisma"
import type { ActionReturn } from "@/actions/type"
import type { ArticleCategory } from '@prisma/client'
import errorHandler from '@/prisma/errorHandler'
import type { ReturnType } from './ReturnType'

export async function readArticleCategories(): Promise<ActionReturn<ArticleCategory[]>> {
    try {
        const categories = await prisma.articleCategory.findMany()
        return { success: true, data: categories }
    } catch (error) {
        return errorHandler(error)
    }
}


export async function readArticleCategory(name: string): Promise<ActionReturn<ReturnType>> {
    try {
        const category = await prisma.articleCategory.findUnique({
            where: {
                name
            },
            include: {
                articles: true
            },
        })
        if (!category) return { success: false, error: [{ message: `Category ${name} not found` }] }
        return { success: true, data: category }
    } catch (error) {
        return errorHandler(error)
    }
}