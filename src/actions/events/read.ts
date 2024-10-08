'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { Session } from '@/auth/Session'
import { Events } from '@/services/events'
import type { ReadPageInput } from '@/services/paging/Types'
import type { EventArchiveCursor, EventArchiveDetails } from '@/services/events/Types'
import { ActionNoData } from '../Action'

export const readCurrentEventsAction = ActionNoData(Events.readCurrent)

export async function readEvent(params: {order: number, name: string}) {
    const session = await Session.fromNextAuth()
    return await safeServerCall(() => Events.read.client('NEW').execute({ params, session }))
}

export async function readArchivedEventsPage<const PageSize extends number>(
    paging: ReadPageInput<PageSize, EventArchiveCursor, EventArchiveDetails>
) {
    const session = await Session.fromNextAuth()
    return await safeServerCall(() => Events.readArchivedPage.client('NEW').execute({ session, params: { paging } }))
}
