import type { Article, CmsImage } from '@prisma/client'
import { ReturnType as ExpandedArticleSection } from '@/cms/articleSections/ReturnType'

export type ReturnType = Article & {
    articleSections: ExpandedArticleSection[],
    coverImage: CmsImage,
}

