import type { CompanyExpanded } from '@/career/companies/Types'
import type { ExpandedArticle } from '@/cms/articles/Types'
import type { JobAd, Image, JobType } from '@prisma/client'
export type ExpandedJobAd<CmsLinkIsCollapsed extends boolean> = JobAd & {
    article: ExpandedArticle<CmsLinkIsCollapsed>,
    company: CompanyExpanded,
}

/*
* This type is used to represent a job ad with a coverImage and companyName
* Used for displaying job ads in a list (read many methods)
*/
export type SimpleJobAd = JobAd & {
    coverImage: Image | null
    companyName: string,
}

export type JobAdInactiveCursor = {
    id: number
}

export type JobAdInactiveDetails = {
    name: string | null
    type: JobType | null
}
