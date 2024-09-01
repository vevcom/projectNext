import { articleRealtionsIncluder } from '@/cms/articles/ConfigVars'
import type { Prisma } from '@prisma/client'

export const jobAdArticleRealtionsIncluder = {
    article: {
        include: articleRealtionsIncluder
    }
} as const satisfies Prisma.JobAdInclude

export const simpleJobAdArticleRealtionsIncluder = {
    article: {
        include: {
            coverImage: {
                include: {
                    image: true
                }
            }
        }
    }
} as const satisfies Prisma.JobAdInclude
