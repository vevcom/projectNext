import type { jobAdSchemas } from './schemas'
import type { CompanyExpanded } from '@/services/career/companies/types'
import type { ExpandedArticle } from '@/cms/articles/types'
import type { InferPagingCursor, InferPagingDetails } from '@/lib/paging/schema'
import type { JobAd, Image } from '@/prisma-generated-pn-types'
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

export type JobAdInactiveCursor = InferPagingCursor<typeof jobAdSchemas.readInactivePage>

export type JobAdInactiveDetails = InferPagingDetails<typeof jobAdSchemas.readInactivePage>
