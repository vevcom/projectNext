'use server'
import { createZodActionError } from '@/actions/error'
import { Events } from '@/services/events'
import { safeServerCall } from '@/actions/safeServerCall'
import { Session } from '@/auth/Session'

export async function createEventAction(rawData: FormData) {
    console.log('createEventAction')
    const parse = Events.create.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    console.log('createEventAction', data)

    const session = await Session.fromNextAuth()

    return await safeServerCall(() => Events.create.client('NEW').execute({ data, params: {}, session }, { withAuth: true }))
}
