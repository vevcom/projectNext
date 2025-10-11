'use client'
import { generatePagingProvider, generatePagingContext } from './PagingGenerator'
import { readSchoolsPageAction } from '@/education/schools/actions'
import type { ExpandedSchool, SchoolCursor } from '@/services/education/schools/types'

export type PageSizeSchool = 8

export const SchoolPagingContext = generatePagingContext<
    ExpandedSchool,
    SchoolCursor,
    PageSizeSchool
>()

export const SchoolPagingProvider = generatePagingProvider({
    Context: SchoolPagingContext,
    fetcher: async ({ paging }) => await readSchoolsPageAction(paging),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
