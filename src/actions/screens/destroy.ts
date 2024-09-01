'use server'
import { AdminScreenAuther } from './Authers'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError } from '@/actions/error'
import { destroyScreen } from '@/services/screens/destroy'
import { Session } from '@/auth/Session'
import type { ActionReturn } from '@/actions/Types'

export async function destroyScreenAction(id: number): Promise<ActionReturn<void>> {
    const authRes = AdminScreenAuther.auth({ session: await Session.fromNextAuth(), dynamicFields: undefined })
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(() => destroyScreen(id))
}
