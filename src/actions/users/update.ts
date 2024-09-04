'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError, createActionError } from '@/actions/error'
import { registerUser, updateUserPassword, verifyUserEmail, registerNewEmail } from '@/services/users/update'
import { getUser } from '@/auth/getUser'
import {
    registerUserValidation,
    updateUserPasswordValidation,
    verifyEmailValidation
} from '@/services/users/validation'
import { verifyResetPasswordToken } from '@/services/auth/resetPassword'
import { ServerError } from '@/services/error'
import { verifyVerifyEmailToken } from '@/services/auth/verifyEmail'
import { User } from '@/services/users'
import { Session } from '@/auth/Session'
import type { RegisterNewEmailType, UserFiltered } from '@/services/users/Types'
import type { ActionReturn } from '@/actions/Types'
import type { User as UserT } from '@prisma/client'
import type { UpdateUserTypes, RegisterUserTypes } from '@/services/users/validation'

export async function updateUserAction(
    id: number,
    rawdata: FormData | UpdateUserTypes['Type']
): Promise<ActionReturn<UserT>> {
    //TODO: Permission check
    const parse = User.update.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(async () => User.update.client('NEW').execute({
        params: { id },
        data,
        session: await Session.fromNextAuth(),
    }, { withAuth: true }))
}

export async function registerNewEmailAction(rawdata: FormData): Promise<ActionReturn<RegisterNewEmailType>> {
    const { user, authorized, status } = await getUser({
        userRequired: true,
    })
    if (!authorized) return createActionError(status)

    const parse = verifyEmailValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => registerNewEmail(user.id, parse.data))
}

export async function registerOwnUser(
    rawdata: FormData | RegisterUserTypes['Type']
): Promise<ActionReturn<UserFiltered>> {
    const { authorized, status, user } = await getUser({
        userRequired: true,
    }) //TODO: Permission check
    if (!authorized) return createActionError(status)
    //TODO: Permission check

    const parse = registerUserValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(() => registerUser(user.id, parse.data))
}

export async function resetPasswordAction(token: string, rawdata: FormData): Promise<ActionReturn<null>> {
    const parse = updateUserPasswordValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)

    return await safeServerCall(async () => {
        if (typeof token !== 'string') {
            throw new ServerError('BAD PARAMETERS', 'The token must be a string.')
        }

        const { userId } = await verifyResetPasswordToken(token)

        await updateUserPassword(userId, parse.data)

        return null
    })
}

export async function verifyUserEmailAction(token: string): Promise<ActionReturn<UserFiltered>> {
    return await safeServerCall(async () => {
        if (typeof token !== 'string') {
            throw new ServerError('BAD PARAMETERS', 'The token must be a string.')
        }

        const {
            userId,
            email
        } = await verifyVerifyEmailToken(token)

        return await verifyUserEmail(userId, email)
    })
}
