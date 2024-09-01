'use client'
import generatePagingProvider, { generatePagingContext } from '@/contexts/paging/PagingGenerator'
import { readLockerPageAction } from '@/actions/lockers/read'
import type { ReadPageInput } from '@/services/paging/Types'
import type { LockerCursor, LockerWithReservation } from '@/services/lockers/Types'

export type PageSizeLocker = 20
const fetcher = async (x: ReadPageInput<PageSizeLocker, LockerCursor>) => await readLockerPageAction(x)

export const LockerPagingContext = generatePagingContext<LockerWithReservation, LockerCursor, PageSizeLocker>()
const LockerPagingProvider = generatePagingProvider({
    Context: LockerPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default LockerPagingProvider
