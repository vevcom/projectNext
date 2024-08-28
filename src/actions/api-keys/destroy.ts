'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { destroyApiKey } from '@/server/api-keys/destroy'
import { getUser } from '@/auth/getUser'
import type { ActionReturn } from '@/actions/Types'

export async function destroyApiKeyAction(id: number): Promise<ActionReturn<void>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['APIKEY_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => destroyApiKey(id))
}
