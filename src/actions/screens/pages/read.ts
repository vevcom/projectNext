'use server'
import { getUser } from '@/auth/getUser'
import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { readPage } from '@/server/screens/pages/read'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedScreenPage } from '@/server/screens/pages/Types'

export async function readPageAction(id: number): Promise<ActionReturn<ExpandedScreenPage>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCREEN_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readPage(id))
}
