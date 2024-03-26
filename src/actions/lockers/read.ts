'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { LockerWithReservation } from '@/server/lockers/Types'
import { readLocker, readLockerPage, updateLockerReservationIfExpired } from '@/server/lockers/read'


export async function readLockerAction(id: number): Promise<ActionReturn<LockerWithReservation>> {
    const result = await safeServerCall(() => readLocker(id))
    if (result.success) {
        await updateLockerReservationIfExpired(result.data)
    }
    return result
}


export async function readLockerPageAction<const PageSize extends number>(
    readPageInput: ReadPageInput<PageSize>
): Promise<ActionReturn<LockerWithReservation[]>> {
    
    const result = await safeServerCall(() => readLockerPage(readPageInput))
    if (result.success) {
        for (let locker of result.data) {
            await updateLockerReservationIfExpired(locker)
        }
    }
    return result
}
