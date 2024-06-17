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
import { readUsersOfGroups } from '@/server/groups/read'

/**
 * An action that creates a locker reservation based on the given data. Duplicate reservations will not be created
 * @param lockerId - The id of the locker to be reserved
 * @param rawdata - The locker reservation to be created
 * @returns - A Promise that resolves to an ActionReturn containing the LockerReservation created
 */
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

    // Verify that the locker is not already reserved
    const locker = await readLockerAction(lockerId)
    if (locker.success) {
        if (locker.data.LockerReservation.length) {
            return createActionError("DUPLICATE")
        }
    }

    // Verify that user is in group
    if (data.groupId) {
        let userInGroup = false
        const groupUsers = await readUsersOfGroups([{ groupId: data.groupId, admin: false }])
        
        for (const groupUser of groupUsers) {
            if (user.id == groupUser.id) {
                userInGroup = true
                break
            } 
        }
        
        if (!userInGroup) {
            return createActionError("UNAUTHORIZED")
        }
    }

    return await safeServerCall(() => createLockerReservation(user.id, lockerId, data))
}
