import type { ExpandedArticle } from '@/cms/articles/Types'
import type { JobAd, Image, Company } from '@prisma/client'
import { CompanyExpanded } from '../companies/Types'
export type ExpandedJobAd = JobAd & {
    article: ExpandedArticle,
    company: CompanyExpanded,
}

//used for read many actions
export type SimpleJobAd = JobAd & {
    coverImage: Image | null
    companyName: string,
}
