'use server'
import prisma from "@/prisma"
import type { ActionReturn } from "@/actions/type"
import type { ArticleCategory } from '@prisma/client'
import errorHandler from '@/prisma/errorHandler'

export async function readArticleCategories(): Promise<ActionReturn<ArticleCategory[]>> {
    try {
        const categories = await prisma.articleCategory.findMany()
        return { success: true, data: categories }
    } catch (error) {
        return errorHandler(error)
    }
}