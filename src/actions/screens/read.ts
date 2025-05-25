'use server'
import { readScreenAuther } from './authers'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { readScreen, readScreens } from '@/services/screens/read'
import { Session } from '@/auth/Session'
import type { Screen } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function readScreenAction(id: number): Promise<ActionReturn<Screen>> {
    const authRes = readScreenAuther.dynamicFields({}).auth(await Session.fromNextAuth())
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(() => readScreen(id))
}

export async function readScreensAction(): Promise<ActionReturn<Screen[]>> {
    const authRes = readScreenAuther.dynamicFields({}).auth(await Session.fromNextAuth())
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(() => readScreens())
}
