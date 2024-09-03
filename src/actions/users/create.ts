'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { CreateUser } from '@/services/users/create'
import { sendUserInvitationEmail } from '@/services/notifications/email/systemMail/userInvitivation'
import type { CreateUserTypes } from '@/services/users/validation'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'
import { CreateUserAuther } from './Authers'
import { Session } from '@/auth/Session'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param rawdata - The user to create
 * @returns - The created user
 */
export async function createUserAction(rawdata: FormData | CreateUserTypes['Type']): Promise<ActionReturn<User>> {
    const parse = CreateUser.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    const authRes = CreateUserAuther.auth({ dynamicFields: undefined, session: await Session.fromNextAuth() })
    if (!authRes.authorized) return createActionError(authRes.status)

    return await safeServerCall(async () => {
        const user = await CreateUser.transaction('NEW_TRANSACTION').execute({ params: {}, data })

        setTimeout(() => sendUserInvitationEmail(user), 1000)

        return user
    })
}

