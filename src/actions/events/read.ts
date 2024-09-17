'use server'

import { Session } from "@/auth/Session"
import { Events } from "@/services/events"
import { safeServerCall } from "../safeServerCall"

export async function readCurrentEvents() {
    const session = await Session.fromNextAuth()
    return await safeServerCall(() => Events.readCurrent.client('NEW').execute({ 
        params: { tags: null, visibilityFilter: {} }, session,
    }))
}