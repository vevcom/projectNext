import type { ExpandedArticleSection } from '@/cms/articleSections/types'
import type { InterestGroup } from '@prisma/client'

export type ExpandedInterestGroup = InterestGroup & {
    articleSection: ExpandedArticleSection
}
