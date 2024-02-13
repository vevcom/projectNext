'use server'
import prisma from "@/prisma"
import type { ActionReturn } from "@/actions/type"
import type { ArticleCategory, Image } from '@prisma/client'
import errorHandler from '@/prisma/errorHandler'
import type { ReturnType } from './ReturnType'

type ReturnTypeMany = Omit<ReturnType, 'articles'>[]

export async function readArticleCategories(): Promise<ActionReturn<ReturnTypeMany>> {
    try {
        const categories = await prisma.articleCategory.findMany({
            include: {
                articles:{
                    take: 1,
                    include: {
                        coverImage: true
                    }
                }
            }
        })
        const categoriesWithCover = await Promise.all(categories.map(async category => (
            {
                ...category,
                coverImage: (await getCoverImage(category))
            }
        )))
        return { success: true, data: categoriesWithCover }
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
        const categoryWithCover = {
            ...category,
            coverImage: await getCoverImage(category)
        }
        return { success: true, data: categoryWithCover }
    } catch (error) {
        return errorHandler(error)
    }
}

/**
 * Get cover image for article category
 * Returns coverImage of a article in the category
 */
async function getCoverImage(category: Omit<ReturnType, 'coverImage'>) : Promise<Image | null> {
    if (category.articles.length === 0) return null
    const coverImage = await prisma.cmsImage.findUnique({
        where: {
            id: category.articles[0].coverImageId,
        },
        include: {
            image: true
        }
    })
    if (!coverImage) return null
    if (!coverImage.image) return null
    return coverImage.image
}