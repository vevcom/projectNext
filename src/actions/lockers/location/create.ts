
'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createLockerLocation } from '@/services/lockers/location/create'
import { createLockerLocationValidation } from '@/services/lockers/location/validation'
import type { CreateLockerLocationTypes } from '@/services/lockers/location/validation'
import type { ActionReturn } from '@/actions/Types'
import type { LockerLocation } from '@prisma/client'


export async function createLockerLocationAction(
    rawdata: FormData | CreateLockerLocationTypes['Type']
): Promise<ActionReturn<LockerLocation>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['LOCKER_CREATE']],
    })
    if (!authorized) return createActionError(status)
    const parse = createLockerLocationValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createLockerLocation(data))
}
