'use server'
import { updateApiKeyValidation } from '@/server/api-keys/validation'
import { updateApiKey } from '@/server/api-keys/update'
import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import type { UpdateApiKeyTypes } from '@/server/api-keys/validation'
import type { ActionReturn } from '@/actions/Types'

export async function updateApiKeyAction(
    id: number,
    rawdata: FormData | UpdateApiKeyTypes['Type']
): Promise<ActionReturn<void>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['APIKEY_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    const parse = updateApiKeyValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateApiKey(id, data))
}
