'use server'
import { ReadScreenAuther } from './Authers'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { readScreen, readScreens } from '@/services/screens/read'
import { Session } from '@/auth/Session'
import type { Screen } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function readScreenAction(id: number): Promise<ActionReturn<Screen>> {
    const authRes = ReadScreenAuther.auth({ session: await Session.fromNextAuth(), dynamicFields: undefined })
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(() => readScreen(id))
}

export async function readScreensAction(): Promise<ActionReturn<Screen[]>> {
    const authRes = ReadScreenAuther.auth({ session: await Session.fromNextAuth(), dynamicFields: undefined })
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(() => readScreens())
}
