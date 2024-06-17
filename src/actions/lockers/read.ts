'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { LockerWithReservation } from '@/server/lockers/Types'
import { readLocker, readLockerPage, updateLockerReservationIfExpired } from '@/server/lockers/read'
import { getUser } from '@/auth/getUser'

/**
 * An action to read a locker, including it´s active reservation.
 * If reservation is expired it will be set to unactive and not returned with the locker
 * @param id - The id of the locker
 * @returns A Promise that resolves to an ActionReturn containing a LockerWithReservation
 */
export async function readLockerAction(id: number): Promise<ActionReturn<LockerWithReservation>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['LOCKER_READ']],
    })
    if (!authorized) return createActionError(status)

    const result = await safeServerCall(() => readLocker(id))
    if (result.success) {
        await updateLockerReservationIfExpired(result.data)
    }
    return result
}

/**
 * An action to read a page of lockers, including their active reservations.
 * Expired reservations will be set to unactive while fetching them
 * @param readPageInput - The page data
 * @returns A Promise that resolves to an ActionReturn containing a LockerWithReservation list
 */
export async function readLockerPageAction<const PageSize extends number>(
    readPageInput: ReadPageInput<PageSize>
): Promise<ActionReturn<LockerWithReservation[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['LOCKER_READ']],
    })
    if (!authorized) return createActionError(status)
    
    const result = await safeServerCall(() => readLockerPage(readPageInput))
    if (result.success) {
        for (let locker of result.data) {
            await updateLockerReservationIfExpired(locker)
        }
    }
    return result
}
