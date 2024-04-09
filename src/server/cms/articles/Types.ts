import type { ExpandedArticleSection } from '@/cms/articleSections/Types'
import type { Article } from '@prisma/client'
import type { ExpandedCmsImage } from '@/cms/images/Types'

export type ExpandedArticle = Article & {
    articleSections: ExpandedArticleSection[],
    coverImage: ExpandedCmsImage,
}

