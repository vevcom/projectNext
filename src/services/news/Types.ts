import type { ExpandedArticle } from '@/cms/articles/Types'
import type { NewsArticle, Image } from '@prisma/client'

export type ExpandedNewsArticle<CmsLinkIsCollapsed extends boolean> = NewsArticle & {
    article: ExpandedArticle<CmsLinkIsCollapsed>
}

/**
 * Type used for the read many articles methods.
 */
export type SimpleNewsArticle = NewsArticle & {
    coverImage: Image | null
}

export type NewsCursor = {
    id: number
}
