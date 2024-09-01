'use server'
import { AdminScreenAuther } from './Authers'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { createScreenValidation, type CreateScreenTypes } from '@/services/screens/validation'
import { createScreen } from '@/services/screens/create'
import { Session } from '@/auth/Session'
import type { Screen } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function createScreenAction(formdata: CreateScreenTypes['Type']): Promise<ActionReturn<Screen>> {
    const authRes = AdminScreenAuther.auth({ session: await Session.fromNextAuth(), dynamicFields: undefined })
    if (!authRes.authorized) return createActionError(authRes.status)

    const parse = createScreenValidation.typeValidate(formdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createScreen(data))
}
