'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { readScreen, readScreens } from '@/server/screens/read'
import type { Screen } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function readScreenAction(id: number): Promise<ActionReturn<Screen>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['SCREEN_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readScreen(id))
}

export async function readScreensAction(): Promise<ActionReturn<Screen[]>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['SCREEN_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readScreens())
}
