'use client'
import { generatePaging } from './PagingGenerator'
import { readSchoolsPageAction } from '@/education/schools/actions'
import type { ExpandedSchool, SchoolCursor } from '@/services/education/schools/types'

export type PageSizeSchool = 8

export const [SchoolPagingContext, SchoolPagingProvider] = generatePaging<
    ExpandedSchool,
    SchoolCursor,
    PageSizeSchool
>({
    fetcher: async ({ paging }) => await readSchoolsPageAction(paging),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
