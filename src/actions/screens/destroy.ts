'use server'
import { adminScreenAuther } from './authers'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { destroyScreen } from '@/services/screens/destroy'
import { Session } from '@/auth/Session'
import type { ActionReturn } from '@/actions/Types'

export async function destroyScreenAction(id: number): Promise<ActionReturn<void>> {
    const authRes = adminScreenAuther.dynamicFields({}).auth(await Session.fromNextAuth())
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(() => destroyScreen(id))
}
