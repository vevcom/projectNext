import '@pn-server-only'
import { articleCategoryAuth } from './auth'
import { articleCategorySchemas } from './schemas'
import { defineOperation } from '../serviceOperation'
import { ServerError } from '../error'
import { implementUpdateArticleOperations } from '@/cms/articles/implement'
import { articleOperations } from '@/cms/articles/operations'
import user from '@/app/admin/mail/[filter]/[id]/(editComponents)/user'
import { z } from 'zod'
import type { ExpandedArticleCategory } from './types'
import type { Image } from '@prisma/client'
import type { PrismaPossibleTransaction } from '../serviceOperation'

export const articleCategoryOperations = {
    create: defineOperation({
        authorizer: () => articleCategoryAuth.create.dynamicFields({}),
        dataSchema: articleCategorySchemas.create,
        operation: ({ prisma, data }) =>
            prisma.articleCategory.create({
                data,
                include: {
                    articles: true
                },
            })
    }),

    destroy: defineOperation({
        authorizer: () => articleCategoryAuth.destroy.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number()
        }),
        operation: ({ prisma, params }) =>
            prisma.articleCategory.delete({
                where: {
                    id: params.id
                },
                include: {
                    articles: true
                }
            })
    }),

    update: defineOperation({
        authorizer: () => articleCategoryAuth.update.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
        }),
        dataSchema: articleCategorySchemas.update,
        operation: ({ prisma, data, params }) =>
            prisma.articleCategory.update({
                where: {
                    id: params.id
                },
                data,
                include: {
                    articles: true
                }
            })
    }),

    addArticleToCategory: defineOperation({
        authorizer: () => articleCategoryAuth.addArticleToCategory.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number()
        }),
        opensTransaction: true,
        operation: ({ prisma, params }) => {
            prisma.$transaction(async (tx) => {
                const article = await articleOperations.create({ data: { }, prisma: tx, bypassAuth: true })
                await prisma.articleCategory.update({
                    where: {
                        id: params.id
                    },
                    data: {
                        articles: {
                            connect: {
                                id: article.id
                            }
                        }
                    }
                })
            })
        }
    }),

    removeArticleFromCategory: defineOperation({
        authorizer: () => articleCategoryAuth.removeArticleFromCategory.dynamicFields({}),
        paramsSchema: z.object({
            id: z.number(),
            articleId: z.number()
        }),
        operation: async ({ prisma, params }) => {
            //check ownership:
            const article = await prisma.article.findUnique({
                where: {
                    id: params.articleId
                }
            })
            if (!article) throw new ServerError('NOT FOUND', `Article ${params.articleId} not found`)
            if (article.articleCategoryId !== params.id) throw new ServerError('BAD PARAMETERS', `Article ${params.articleId} does not belong to category ${params.id}`)

            await articleOperations.destroy({ params: { articleId: params.articleId }, prisma })
        }
    }),

    updateArticle: implementUpdateArticleOperations({
        authorizer: () => articleCategoryAuth.updateArticle.dynamicFields({}),
        implementationParamsSchema: z.object({
            articleCategoryId: z.number(),
        }),
        ownedArticles: ({ implementationParams, prisma }) => prisma.article.findMany({
            where: {
                articleCategoryId: implementationParams.articleCategoryId
            },
            include: {
                coverImage: true,
                articleSections: {
                    include: {
                        cmsImage: true,
                        cmsLink: true,
                        cmsParagraph: true
                    }
                }
            }
        })
    }),

    readAll: defineOperation({
        authorizer: () => articleCategoryAuth.readAll.dynamicFields({}),
        operation: async ({ prisma }) => {
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
                    coverImage: (await getCoverImage(prisma, category))
                }
            )))
            return categoriesWithCover
        }
    }),

    read: defineOperation({
        authorizer: () => articleCategoryAuth.read.dynamicFields({}),
        paramsSchema: z.object({
            name: z.string()
        }),
        operation: async ({ prisma, params }) => {
            const category = await prisma.articleCategory.findUnique({
                where: {
                    name: params.name
                },
                include: {
                    articles: {
                        orderBy: {
                            createdAt: 'desc'
                        }
                    }
                },
            })
            if (!category) throw new ServerError('NOT FOUND', `Category ${params.name} not found`)
            const categoryWithCover = {
                ...category,
                coverImage: await getCoverImage(prisma, category)
            }
            return categoryWithCover
        }
    }),

    readArticleInCategory: articleOperations.read.implement({
        authorizer: () => articleCategoryAuth.readArticleInCategory.dynamicFields({}),
        implementationParamsSchema: z.object({
            articleCategoryName: z.string()
        }),
        ownershipCheck: async ({ prisma, params, implementationParams }) => {
            const article = await prisma.article.findUnique({
                where: {
                    id: params.articleId
                }
            })
            const articleCategoryId = await prisma.articleCategory.findUniqueOrThrow({
                where: {
                    name: implementationParams.articleCategoryName
                },
                select: {
                    id: true
                }
            }).then(res => res.id)
            if (!article) throw new ServerError('NOT FOUND', 'Artikkel ikke funnet.')
            return article.articleCategoryId ? article.articleCategoryId === articleCategoryId : false
        }
    })
} as const

/**
 * Get coverimage (not cmsImage just the image it relates to) for article category
 * Returns coverImage of a article in the category. The cover image for the category is the cover
 * image of the first article in the category.
 * @param category - The category to get cover image for
 * @returns The cover image of the category
 */
async function getCoverImage(prisma: PrismaPossibleTransaction<false>, category: ExpandedArticleCategory): Promise<Image | null> {
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
