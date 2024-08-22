'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { createLocker } from '@/server/lockers/create'
import { createLockerValidation } from '@/server/lockers/validation'
import type { CreateLockerTypes } from '@/server/lockers/validation'

export async function createLockerAction(rawdata: FormData | CreateLockerTypes['Type']) {
    const { status, authorized } = await getUser({
        requiredPermissions: [['LOCKER_CREATE']],
    })
    if (!authorized) return createActionError(status)

    const parse = createLockerValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createLocker(data))
}
