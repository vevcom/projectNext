'use server'

import { createActionError, createZodActionError } from '../error'
import { safeServerCall } from '../safeServerCall'
import { createApiKeyValidation, type CreateApiKeyTypes } from '@/server/api-keys/validation'
import { getUser } from '@/auth/getUser'
import { createApiKey } from '@/server/api-keys/create'
import type { ApiKeyFilteredWithKey } from '@/server/api-keys/Types'
import type { ActionReturn } from '../Types'

export async function createApiKeyAction(rawdata: FormData | CreateApiKeyTypes['Type']): Promise<ActionReturn<ApiKeyFilteredWithKey>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['APIKEY_ADMIN']]
    })
    if (!authorized) return createActionError(status)
    const parse = createApiKeyValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createApiKey(data))
}
