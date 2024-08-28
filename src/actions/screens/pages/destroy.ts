'use server'
import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { destroyPage } from '@/services/screens/pages/destroy'
import type { ActionReturn } from '@/actions/Types'


export async function destroyPageAction(id: number): Promise<ActionReturn<void>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCREEN_ADMIN']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => destroyPage(id))
}
