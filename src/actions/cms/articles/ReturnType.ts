import type { Article } from '@prisma/client'
import { ReturnType as ExpandedArticleSection } from '@/cms/articleSections/ReturnType'

export type ReturnType = Article & {
    articleSections: ExpandedArticleSection[],
}