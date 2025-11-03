import { articleSectionsRealtionsIncluder } from '@/cms/articleSections/constants'
import type { Prisma } from '@prisma/client'

export const maxSections = 10 // Max 10 sections in an article

export const articleRealtionsIncluder = {
    articleSections: {
        include: articleSectionsRealtionsIncluder
    },
    coverImage: {
        include: {
            image: true
        },
    },
} as const satisfies Prisma.ArticleInclude
