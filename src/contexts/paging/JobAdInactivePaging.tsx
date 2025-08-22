'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readInactiveJobAdsPageAction } from '@/services/career/jobAds/actions'
import type { ReadPageInput } from '@/lib/paging/Types'
import type { JobAdInactiveCursor, JobAdInactiveDetails, SimpleJobAd } from '@/services/career/jobAds/Types'

export type PageSizeJobAdInactive = 12
const fetcher = async (x: ReadPageInput<PageSizeJobAdInactive, JobAdInactiveCursor, JobAdInactiveDetails>) =>
    await readInactiveJobAdsPageAction({ paging: x })

export const JobAdInactivePagingContext = generatePagingContext<
    SimpleJobAd,
    JobAdInactiveCursor,
    PageSizeJobAdInactive,
    JobAdInactiveDetails
>()
const JobAdInactiveProvider = generatePagingProvider({
    Context: JobAdInactivePagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default JobAdInactiveProvider
