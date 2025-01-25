'use server'
import { action } from '@/actions/action'
import { safeServerCall } from '@/actions/safeServerCall'
import { Session } from '@/auth/Session'
import { readArchivedEventsPage, readCurrentEvents, readEvent } from '@/services/events/read'

export const readCurrentEventsAction = action(readCurrentEvents)

export async function readEventAction(params: {order: number, name: string}) {
    const session = await Session.fromNextAuth()
    return await safeServerCall(() => readEvent.newClient().execute({ params, session }))
}

export const readArchivedEventsPageAction = action(readArchivedEventsPage)
