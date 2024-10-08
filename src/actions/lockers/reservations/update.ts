'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { readUsersOfGroups } from '@/services/groups/read'
import { readLockerReservation } from '@/services/lockers/reservations/read'
import { updateLockerReservation } from '@/services/lockers/reservations/update'
import { lockerReservationValidation } from '@/services/lockers/reservations/validation'
import type { LockerReservationValidationTypes } from '@/services/lockers/reservations/validation'
import type { ActionReturn } from '@/actions/Types'
import type { LockerReservation } from '@prisma/client'

/**
 * An action that updates a locker reservation based on the given data
 * @param reservationId - The id of the reservation to be updated
 * @param rawdata - The data to be updated
 * @returns - A Promise that resolves to an ActionReturn containing the LockerReservation updated
 */
export async function updateLockerReservationAction(
    reservationId: number,
    rawdata: FormData | LockerReservationValidationTypes['Type']
): Promise<ActionReturn<LockerReservation>> {
    const { user, status, authorized } = await getUser({
        requiredPermissions: [['LOCKERRESERVATION_UPDATE']],
        userRequired: true,
    })

    if (!authorized) return createActionError(status)

    const parse = lockerReservationValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    // Verify that the user updating is the creator of the reservation
    const reservation = await readLockerReservation(reservationId)
    if (!reservation) {
        return createActionError('NOT FOUND')
    }
    if (user.id !== reservation.userId) {
        return createActionError('UNAUTHORIZED')
    }

    // Verify that user is in group
    if (data.groupId) {
        let userInGroup = false
        const groupUsers = await readUsersOfGroups([{ groupId: data.groupId, admin: false }])

        for (const groupUser of groupUsers) {
            if (user.id === groupUser.id) {
                userInGroup = true
                break
            }
        }

        if (!userInGroup) {
            return createActionError('UNAUTHORIZED')
        }
    }

    return await safeServerCall(() => updateLockerReservation(reservationId, data))
}
