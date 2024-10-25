'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readCompanyPageAction } from '@/actions/career/companies/read'
import type { CompanyCursor, CompanyDetails, CompanyExpanded } from '@/services/career/companies/Types'
import type { ReadPageInput } from '@/services/paging/Types'

export type PageSizeCompany = 10
const fetcher = async (x: ReadPageInput<PageSizeCompany, CompanyCursor, CompanyDetails>) => {
    const ret = await readCompanyPageAction.bind(null, { paging: x })()
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
