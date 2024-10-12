'use server'

import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { Session } from '@/auth/Session'
import { Events } from '@/services/events'

export async function updateEventAction(params: { id: number }, rawData: FormData) {
    const session = await Session.fromNextAuth()

    const parse = Events.update.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => Events.update.client('NEW').execute({ params, data, session }))
}
