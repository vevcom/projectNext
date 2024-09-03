'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { destroyScreen } from '@/services/screens/destroy'
import type { ActionReturn } from '@/actions/Types'

export async function destroyScreenAction(id: number): Promise<ActionReturn<void>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['SCREEN_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => destroyScreen(id))
}
