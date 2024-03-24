'use client'
import generatePagingProvider, { generatePagingContext } from '@/context/paging/PagingGenerator'
import { readLockerPage } from '@/actions/lockers/read'
import type { ReadPageInput } from '@/actions/Types'
import type { LockerWithReservation } from '@/actions/lockers/Types'

export type PageSizeLocker = 20
const fetcher = async (x: ReadPageInput<PageSizeLocker>) => await readLockerPage(x)

export const LockerPagingContext = generatePagingContext<LockerWithReservation, PageSizeLocker>()
const LockerPagingProvider = generatePagingProvider({ Context: LockerPagingContext, fetcher })
export default LockerPagingProvider
