'use client'
import { generatePagingProvider, generatePagingContext } from './PagingGenerator'
import { readInactiveJobAdsPageAction } from '@/services/career/jobAds/actions'
import type { JobAdInactiveCursor, JobAdInactiveDetails, SimpleJobAd } from '@/services/career/jobAds/types'

export type PageSizeJobAdInactive = 12

export const JobAdInactivePagingContext = generatePagingContext<
    SimpleJobAd,
    JobAdInactiveCursor,
    PageSizeJobAdInactive,
    JobAdInactiveDetails
>()

export const JobAdInactiveProvider = generatePagingProvider({
    Context: JobAdInactivePagingContext,
    fetcher: async ({ paging }) => await readInactiveJobAdsPageAction({ paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
