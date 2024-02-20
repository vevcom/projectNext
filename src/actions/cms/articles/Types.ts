import type { ReturnType as ExpandedArticleSection } from '@/cms/articleSections/Types'
import type { Article, CmsImage } from '@prisma/client'

export type ReturnType = Article & {
    articleSections: ExpandedArticleSection[],
    coverImage: CmsImage,
}

