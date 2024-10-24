'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readSchoolsPageAction } from '@/education/schools/read'
import type { ReadPageInput } from '@/services/paging/Types'
import type { ExpandedSchool, SchoolCursor } from '@/education/schools/Types'

export type PageSizeSchool = 8
const fetcher = async (x: ReadPageInput<PageSizeSchool, SchoolCursor>) => {
    const res = await readSchoolsPageAction(x)
    return res
}

export const SchoolPagingContext = generatePagingContext<
    ExpandedSchool<true>,
    SchoolCursor,
    PageSizeSchool
>()
const SchoolPagingProvider = generatePagingProvider({
    Context: SchoolPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default SchoolPagingProvider
