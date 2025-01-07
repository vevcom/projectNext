'use server'
import { Action } from '@/actions/Action'
import { safeServerCall } from '@/actions/safeServerCall'
import { Session } from '@/auth/Session'
import { readArchivedEventsPage, readCurrentEvents, readEvent } from '@/services/events/read'

export const readCurrentEventsAction = Action(readCurrentEvents)

export async function readEventAction(params: {order: number, name: string}) {
    const session = await Session.fromNextAuth()
    return await safeServerCall(() => readEvent.newClient().execute({ params, session }))
}

export const readArchivedEventsPageAction = Action(readArchivedEventsPage)
