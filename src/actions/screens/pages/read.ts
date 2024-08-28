'use server'
import { getUser } from '@/auth/getUser'
import { createActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { readPage, readPages } from '@/services/screens/pages/read'
import type { ScreenPage } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedScreenPage } from '@/services/screens/pages/Types'

export async function readPageAction(id: number): Promise<ActionReturn<ExpandedScreenPage>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCREEN_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readPage(id))
}

export async function readPagesAction(): Promise<ActionReturn<ScreenPage[]>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['SCREEN_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readPages())
}
