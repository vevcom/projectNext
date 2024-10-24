import type { Prisma } from '@prisma/client'

export const CmsLinkRelationsIncluder = {
    imageCollection: {
        select: {
            name: true
        }
    },
    newsArticle: {
        select: {
            orderPublished: true,
            articleName: true,
        }
    },
    articleCategoryArticle: {
        select: {
            name: true,
            articleCategory: {
                select: {
                    name: true
                }
            }
        }
    }
} as const satisfies Prisma.CmsLinkInclude
