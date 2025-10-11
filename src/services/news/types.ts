import type { ExpandedArticle } from '@/cms/articles/types'
import type { NewsArticle, Image } from '@prisma/client'

export type ExpandedNewsArticle = NewsArticle & {
    article: ExpandedArticle
}

//used for read many actions
export type SimpleNewsArticle = NewsArticle & {
    coverImage: Image | null
}

export type NewsCursor = {
    id: number
}
