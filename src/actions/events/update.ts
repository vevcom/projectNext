'use server'

import { Session } from "@/auth/Session"
import { safeServerCall } from "../safeServerCall"
import { Events } from "@/services/events"
import { createZodActionError } from "../error"

export async function updateEventAction(params: { id: number }, rawData: FormData) {
    const session = await Session.fromNextAuth()

    const parse = Events.update.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => Events.update.client('NEW').execute({ params, data, session }))
}