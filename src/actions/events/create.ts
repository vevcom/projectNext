'use server'
import { Events } from "@/services/events";
import { createZodActionError } from "../error";
import { safeServerCall } from "@/actions/safeServerCall";
import { Session } from '@/auth/Session'

export async function createEventAction(rawData: FormData) {
    const parse = Events.create.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    const session = await Session.fromNextAuth()

    return await safeServerCall(() => Events.create.client('NEW').execute({ data, params: {}, session }, { withAuth: true }))
}