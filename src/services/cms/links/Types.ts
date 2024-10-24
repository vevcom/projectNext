import type { CmsLink } from '@prisma/client'

/**
 * Type with necessary information to create a cms link (CmsLinkCollapsed) of any type.
 */
export type CmsLinkExpanded = CmsLink & {
    articleCategoryArticle: {
        name: string
        articleCategory: {
            name: string
        } | null
    } | null,
    imageCollection: {
        name: string
    } | null,
    newsArticle: {
        articleName: string
        orderPublished: number
    } | null,
}

/**
 * A type that a cms link of any type can be transformed to. The way it is is
 * specified in the type of the cms link.
 */
export type CmsLinkCollapsed = {
    id: number,
    text: string
    url: string
}
