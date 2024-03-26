'use client'
import generatePagingProvider, { generatePagingContext } from '@/context/paging/PagingGenerator'
import { readLockerPageAction } from '@/actions/lockers/read'
import type { ReadPageInput } from '@/actions/Types'
import type { LockerWithReservation } from '@/server/lockers/Types'

export type PageSizeLocker = 20
const fetcher = async (x: ReadPageInput<PageSizeLocker>) => await readLockerPageAction(x)

export const LockerPagingContext = generatePagingContext<LockerWithReservation, PageSizeLocker>()
const LockerPagingProvider = generatePagingProvider({ Context: LockerPagingContext, fetcher })
export default LockerPagingProvider
