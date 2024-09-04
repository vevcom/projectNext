'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { sendUserInvitationEmail } from '@/services/notifications/email/systemMail/userInvitivation'
import { Session } from '@/auth/Session'
import { User } from '@/services/users'
import type { CreateUserTypes } from '@/services/users/validation'
import type { ActionReturn } from '@/actions/Types'
import type { User as UserT } from '@prisma/client'

/**
 * A action that creates a user by the given data. It will also hash the password
 * @param rawdata - The user to create
 * @returns - The created user
 */
export async function createUserAction(rawdata: FormData | CreateUserTypes['Type']): Promise<ActionReturn<UserT>> {
    const parse = User.create.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(async () => {
        const user = await User.create.client('NEW').execute({
            data,
            params: undefined,
            session: await Session.fromNextAuth(),
        }, { withAuth: true })

        setTimeout(() => sendUserInvitationEmail(user), 1000)

        return user
    })
}

