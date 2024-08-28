'use server'
import { createActionError } from '../error'
import { safeServerCall } from '../safeServerCall'
import { getUser } from '@/auth/getUser'
import { readApiKey, readApiKeys } from '@/server/api-keys/read'
import type { ApiKeyFiltered } from '@/server/api-keys/Types'
import type { ActionReturn } from '../Types'

export async function readApiKeysAction(): Promise<ActionReturn<ApiKeyFiltered[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['APIKEY_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readApiKeys())
}

export async function readApiKeyAction(id: number): Promise<ActionReturn<ApiKeyFiltered>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['APIKEY_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readApiKey(id))
}
