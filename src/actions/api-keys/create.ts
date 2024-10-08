'use server'
import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { createApiKeyValidation, type CreateApiKeyTypes } from '@/services/api-keys/validation'
import { getUser } from '@/auth/getUser'
import { createApiKey } from '@/services/api-keys/create'
import type { ApiKeyFilteredWithKey } from '@/services/api-keys/Types'
import type { ActionReturn } from '@/actions/Types'

export async function createApiKeyAction(
    rawdata: FormData | CreateApiKeyTypes['Type']
): Promise<ActionReturn<ApiKeyFilteredWithKey>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['APIKEY_ADMIN']]
    })
    if (!authorized) return createActionError(status)
    const parse = createApiKeyValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createApiKey(data))
}
