import type { ExpandedArticle } from '@/cms/articles/Types'
import type { JobAd, Image, Company } from '@prisma/client'
export type ExpandedJobAd = JobAd & {
    article: ExpandedArticle,
    company: Company,
}

//used for read many actions
export type SimpleJobAd = JobAd & {
    coverImage: Image | null
    companyName: string,
}
