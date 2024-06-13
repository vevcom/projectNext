
'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createLockerLocation } from '@/server/lockers/location/create'
import { createLockerLocationValidation } from '@/server/lockers/location/validation'
import type { CreateLockerLocationTypes } from '@/server/lockers/location/validation'
import type { ActionReturn } from '@/actions/Types'
import type { LockerLocation } from '@prisma/client'


export async function createLockerLocationAction(
    rawdata: FormData | CreateLockerLocationTypes['Type']
): Promise<ActionReturn<LockerLocation>> {
    const { user, status, authorized } = await getUser({
        requiredPermissions: [['LOCKER_READ']], // Should be changed to LOCKER_CREATE ########################################################################################
        userRequired: true,
    })
    if (!authorized) return createActionError(status)
    const parse = createLockerLocationValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createLockerLocation(data))
}
