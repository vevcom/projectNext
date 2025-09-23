import type { ExpandedArticle } from '@/services/cms/articles/Types'
import type { NewsArticle, Image, Visibility } from '@prisma/client'

export type ExpandedNewsArticle = NewsArticle & {
    article: ExpandedArticle
    visibility: Visibility
}

//used for read many actions
export type SimpleNewsArticle = NewsArticle & {
    coverImage: Image | null
    visibility: Visibility
}

export type NewsCursor = {
    id: number
}
