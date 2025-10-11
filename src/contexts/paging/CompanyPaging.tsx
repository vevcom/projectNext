'use client'
import { generatePagingProvider, generatePagingContext } from './PagingGenerator'
import { readCompanyPageAction } from '@/services/career/companies/actions'
import type { CompanyCursor, CompanyDetails, CompanyExpanded } from '@/services/career/companies/types'

export type PageSizeCompany = 10

export const CompanyPagingContext = generatePagingContext<
    CompanyExpanded,
    CompanyCursor,
    PageSizeCompany,
    CompanyDetails
>()

export const CompanyPagingProvider = generatePagingProvider({
    Context: CompanyPagingContext,
    fetcher: async ({ paging }) => await readCompanyPageAction({ paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
