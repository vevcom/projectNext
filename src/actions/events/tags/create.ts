'use server'
import { createZodActionError } from '@/actions/error'
import { EventTags } from '@/services/events/tags'
import { safeServerCall } from '@/actions/safeServerCall'
import { Session } from '@/auth/Session'

export async function createEventAction(rawData: FormData) {
    const parse = EventTags.create.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    const session = await Session.fromNextAuth()

    return await safeServerCall(() => EventTags.create.client('NEW').execute({ data, params: {}, session }, { withAuth: true }))
}
