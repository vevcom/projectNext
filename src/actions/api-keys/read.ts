'use server'
import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { readApiKey, readApiKeys } from '@/server/api-keys/read'
import type { ApiKeyFiltered } from '@/server/api-keys/Types'
import type { ActionReturn } from '@/actions/Types'

export async function readApiKeysAction(): Promise<ActionReturn<ApiKeyFiltered[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['APIKEY_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readApiKeys())
}

export async function readApiKeyAction(idOrName: number | string): Promise<ActionReturn<ApiKeyFiltered>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['APIKEY_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readApiKey(idOrName))
}
