'use client'
import { generatePaging } from './PagingGenerator'
import { readCompanyPageAction } from '@/services/career/companies/actions'
import type { CompanyCursor, CompanyDetails, CompanyExpanded } from '@/services/career/companies/types'

export type PageSizeCompany = 10

export const [CompanyPagingContext, CompanyPagingProvider] = generatePaging<
    CompanyExpanded,
    CompanyCursor,
    PageSizeCompany,
    CompanyDetails
>({
    fetcher: async ({ paging }) => await readCompanyPageAction({ params: { paging } }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
