import { articleRealtionsIncluder } from '@/cms/articles/constants'
import type { Prisma } from '@prisma/client'

export const defaultNewsArticleOldCutoff = 7 // by default a newsarticle is considered old after 7 days

export const newsArticleRealtionsIncluder = {
    article: {
        include: articleRealtionsIncluder
    }
} as const satisfies Prisma.NewsArticleInclude

export const simpleNewsArticleRealtionsIncluder = {
    article: {
        include: {
            coverImage: {
                include: {
                    image: true
                }
            }
        }
    }
} as const satisfies Prisma.NewsArticleInclude
