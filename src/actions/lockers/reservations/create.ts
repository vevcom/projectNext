'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createLockerReservation } from '@/server/lockers/reservations/create'
import { createLockerReservationValidation } from '@/server/lockers/reservations/validation'
import type { CreateLockerReservationTypes } from '@/server/lockers/reservations/validation'
import type { ActionReturn } from '@/actions/Types'
import type { LockerReservation } from '@prisma/client'

export async function createLockerReservationAction(
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

    return await safeServerCall(() => createLockerReservation(user.id, data))
}
