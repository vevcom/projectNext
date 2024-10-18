import { ExpandedArticleSection } from '@/services/cms/articleSections/Types'
import type { InterestGroup } from '@prisma/client'

export type ExpandedInterestGroup = InterestGroup & {
    articleSection: ExpandedArticleSection
}
