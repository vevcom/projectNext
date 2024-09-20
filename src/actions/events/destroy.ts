'use server'

import { Session } from "@/auth/Session"
import { safeServerCall } from "../safeServerCall"
import { Events } from "@/services/events"

export async function destroyEvent(params: { id: number }) {
    const session = await Session.fromNextAuth()

    return await safeServerCall(() => Events.destroy.client('NEW').execute({ session, params }))
}