'use client'
import { generatePagingContext, generatePagingProvider } from '@/contexts/paging/PagingGenerator'
import { readLockerPageAction } from '@/services/lockers/actions'
import type { LockerCursor, LockerWithReservation } from '@/services/lockers/types'

export type PageSizeLocker = 20

export const LockerPagingContext = generatePagingContext<LockerWithReservation, LockerCursor, PageSizeLocker>()
export const LockerPagingProvider = generatePagingProvider({
    Context: LockerPagingContext,
    fetcher: async ({ paging }) => await readLockerPageAction({ paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
