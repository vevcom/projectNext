import { articleRealtionsIncluder } from '@/cms/articles/ConfigVars'

export const defaultNewsArticleOldCutoff = 7 // by default a newsarticle is considered old after 7 days

export const newsArticleRealtionsIncluder = {
    article: {
        include: articleRealtionsIncluder
    }
} as const
