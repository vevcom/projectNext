'use client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readSchoolsPageAction } from '@/education/schools/actions'
import type { ReadPageInput } from '@/lib/paging/types'
import type { ExpandedSchool, SchoolCursor } from '@/services/education/schools/types'

export type PageSizeSchool = 8
const fetcher = async (x: ReadPageInput<PageSizeSchool, SchoolCursor>) => {
    const res = await readSchoolsPageAction(x)
    return res
}

export const SchoolPagingContext = generatePagingContext<
    ExpandedSchool,
    SchoolCursor,
    PageSizeSchool
>()
const SchoolPagingProvider = generatePagingProvider({
    Context: SchoolPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default SchoolPagingProvider
