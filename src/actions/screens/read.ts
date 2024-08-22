'use server'
import { safeServerCall } from '../safeServerCall'
import { createActionError } from '@/actions/error'
import { createScreen } from '@/server/screens/create'
import { getUser } from '@/auth/getUser'
import type { Screen } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import { readScreen } from '@/server/screens/read'

export async function readScreenAction(id: number): Promise<ActionReturn<Screen>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['SCREEN_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readScreen(id))
}
