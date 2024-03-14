import 'server-only'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import type { Image } from '@prisma/client'
import type {
    ExpandedArticleCategory,
    ExpandedArticleCategoryWithCover,
    ArticleCategoryWithCover,
} from '@/cms/articleCategories/Types'

/**
 * Reads all article categories, and assaigs each of them a cover based on the cover of first article
 * in each category.
 * @returns - the article categories with a cover.
 */
export async function readArticleCategories(): Promise<ActionReturn<ArticleCategoryWithCover[]>> {
    try {
        const categories = await prisma.articleCategory.findMany({
            include: {
                articles: {
                    take: 1,
                    include: {
                        coverImage: true
                    }
                },
            },
            orderBy: {
                createdAt: 'desc'
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
        return createPrismaActionError(error)
    }
}


/**
 * Reads an articleCategory, and chooses an coverimage as first articles cover.
 * Also returns all the articles in the category.
 * @param name - THe name of the article category to read
 * @returns - Article with chosen cover image
 */
export async function readArticleCategory(name: string): Promise<ActionReturn<ExpandedArticleCategoryWithCover>> {
    try {
        const category = await prisma.articleCategory.findUnique({
            where: {
                name
            },
            include: {
                articles: {
                    orderBy: {
                        createdAt: 'desc'
                    }
                }
            },
        })
        if (!category) return createActionError('NOT FOUND', `Category ${name} not found`)
        const categoryWithCover = {
            ...category,
            coverImage: await getCoverImage(category)
        }
        return { success: true, data: categoryWithCover }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

/**
 * Get coverimage (not cmsImage just the image it relates to) for article category
 * Returns coverImage of a article in the category. The cover image for the category is the cover
 * image of the first article in the category.
 * @param category - The category to get cover image for
 * @returns The cover image of the category
 */
async function getCoverImage(category: ExpandedArticleCategory): Promise<Image | null> {
    if (category.articles.length === 0) return null
    const coverImage = await prisma.cmsImage.findUnique({
        where: {
            id: category.articles[0].coverImageId
        },
        include: {
            image: true
        }
    })
    if (!coverImage) return null
    if (!coverImage.image) return null
    return coverImage.image
}