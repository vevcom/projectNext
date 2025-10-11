import type { ExpandedArticleSection } from '@/cms/articleSections/types'
import type { Article } from '@prisma/client'
import type { ExpandedCmsImage } from '@/cms/images/types'

export type ExpandedArticle = Article & {
    articleSections: ExpandedArticleSection[],
    coverImage: ExpandedCmsImage,
}

