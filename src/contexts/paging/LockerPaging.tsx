'use client'
import generatePagingProvider, { generatePagingContext } from '@/contexts/paging/PagingGenerator'
import { readLockerPageAction } from '@/services/lockers/actions'
import type { ReadPageInput } from '@/lib/paging/types'
import type { LockerCursor, LockerWithReservation } from '@/services/lockers/types'

export type PageSizeLocker = 20
const fetcher = async (paging: ReadPageInput<PageSizeLocker, LockerCursor>) => await readLockerPageAction({ paging })

export const LockerPagingContext = generatePagingContext<LockerWithReservation, LockerCursor, PageSizeLocker>()
const LockerPagingProvider = generatePagingProvider({
    Context: LockerPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default LockerPagingProvider
