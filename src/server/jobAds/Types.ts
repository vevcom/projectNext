import type { ExpandedArticle } from '../cms/articles/Types'
import type { JobAd } from '@prisma/client'
export type ExpandedJobAd = JobAd & {
    article: ExpandedArticle
}