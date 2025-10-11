'use client'
import { generatePaging } from '@/contexts/paging/PagingGenerator'
import { readLockerPageAction } from '@/services/lockers/actions'
import type { LockerCursor, LockerWithReservation } from '@/services/lockers/types'

export type PageSizeLocker = 20

export const [LockerPagingContext, LockerPagingProvider] = generatePaging<
    LockerWithReservation,
    LockerCursor,
    PageSizeLocker
>({
    fetcher: async ({ paging }) => await readLockerPageAction({ params: { paging } }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
