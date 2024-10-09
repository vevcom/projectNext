'use server'
import { ActionNoData } from '@/actions/Action'
import { safeServerCall } from '@/actions/safeServerCall'
import { Session } from '@/auth/Session'
import { Events } from '@/services/events'

export const readCurrentEventsAction = ActionNoData(Events.readCurrent)

export async function readEvent(params: {order: number, name: string}) {
    const session = await Session.fromNextAuth()
    return await safeServerCall(() => Events.read.client('NEW').execute({ params, session }))
}

export const readArchivedEventsPage = ActionNoData(Events.readArchivedPage)
