import type { ExpandedArticleSection } from '@/cms/articleSections/Types'
import type { Article, CmsImage } from '@prisma/client'

export type ExpandedArticle = Article & {
    articleSections: ExpandedArticleSection[],
    coverImage: CmsImage,
}

