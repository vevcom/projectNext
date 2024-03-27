'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createLockerReservation } from '@/server/lockers/reservations/create'
import { createLockerReservationValidation } from '@/server/lockers/reservations/validation'
import type { CreateLockerReservationTypes } from '@/server/lockers/reservations/validation'
import type { ActionReturn } from '@/actions/Types'
import type { LockerReservation } from '@prisma/client'
import { readLockerAction } from '../read'

export async function createLockerReservationAction(
    lockerId: number,
    rawdata: FormData | CreateLockerReservationTypes['Type']
): Promise<ActionReturn<LockerReservation>> {
    const { user, status, authorized } = await getUser({
        requiredPermissions: [['LOCKERRESERVATION_CREATE']],
        userRequired: true,
    })
    if (!authorized) return createActionError(status)

    const parse = createLockerReservationValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    const locker = await readLockerAction(lockerId)
    if (locker.success) {
        if (locker.data.LockerReservation.length) {
            return createActionError("DUPLICATE")
        }
    }

    return await safeServerCall(() => createLockerReservation(user.id, lockerId, data))
}
