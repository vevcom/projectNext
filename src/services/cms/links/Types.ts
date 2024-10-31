import type { CmsLink } from '@prisma/client'

/**
 * Type with necessary information to create a cms link (CmsLinkInfered) of any type.
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
export type CmsLinkInfered = CmsLinkExpanded & {
    text: string
    url: string
}
