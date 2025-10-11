'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readCompanyPageAction } from '@/services/career/companies/actions'
import type { CompanyCursor, CompanyDetails, CompanyExpanded } from '@/services/career/companies/types'
import type { ReadPageInput } from '@/lib/paging/types'

export type PageSizeCompany = 10
const fetcher = async (x: ReadPageInput<PageSizeCompany, CompanyCursor, CompanyDetails>) => {
    const ret = await readCompanyPageAction({ paging: x })
    return ret
}

export const CompanyPagingContext = generatePagingContext<
    CompanyExpanded,
    CompanyCursor,
    PageSizeCompany,
    CompanyDetails
>()
const CompanyPagingProvider = generatePagingProvider({
    Context: CompanyPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default CompanyPagingProvider
