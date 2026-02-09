import type { newsArticleRealtionsIncluder } from './constants'
import type { NewsArticle, Image, Prisma } from '@/prisma-generated-pn-types'

export type ExpandedNewsArticle = Prisma.NewsArticleGetPayload<{
    include: typeof newsArticleRealtionsIncluder
}>

//used for read many actions
export type SimpleNewsArticle = NewsArticle & {
    coverImage: Image | null
}

export type NewsCursor = {
    id: number
}
