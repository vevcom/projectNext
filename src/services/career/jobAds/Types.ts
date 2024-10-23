import type { ExpandedArticle } from '@/cms/articles/Types'
import type { JobAd, Image, Company, JobType } from '@prisma/client'
import { CompanyExpanded } from '../companies/Types'
export type ExpandedJobAd = JobAd & {
    article: ExpandedArticle,
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