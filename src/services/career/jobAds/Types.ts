import type { ExpandedArticle } from '@/cms/articles/Types'
import type { JobAd, Image } from '@prisma/client'
export type ExpandedJobAd = JobAd & {
    article: ExpandedArticle
}

//used for read many actions
export type SimpleJobAd = JobAd & {
    coverImage: Image | null
}
