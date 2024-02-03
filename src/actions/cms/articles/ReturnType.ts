import { ReturnType as ExpandedArticleSection } from '@/cms/articleSections/ReturnType'
import type { Article, CmsImage } from '@prisma/client'

export type ReturnType = Article & {
    articleSections: ExpandedArticleSection[],
    coverImage: CmsImage,
}

