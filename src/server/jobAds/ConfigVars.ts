import { articleRealtionsIncluder } from '@/cms/articles/ConfigVars'

export const jobAdArticleRealtionsIncluder = {
    article: {
        include: articleRealtionsIncluder
    }
} as const

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
} as const