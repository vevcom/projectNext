'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createLocker } from '@/server/lockers/create'
import { CreateLockerTypes, createLockerValidation } from '@/server/lockers/validation'

export async function createLockerAction(rawdata: FormData | CreateLockerTypes['Type']) {
    const parse = createLockerValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createLocker(data))
}
