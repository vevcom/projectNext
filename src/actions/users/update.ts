'use server'
import { action } from '@/actions/action'
import { verifyResetPasswordToken } from '@/services/auth/resetPassword'
import { UserMethods } from '@/services/users/methods'

export const updateUserAction = action(UserMethods.update)
export const registerNewEmailAction = action(UserMethods.registerNewEmail)
export const registerUser = action(UserMethods.register)

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

export const registerStudentCardInQueueAction = action(registerStudentCardInQueue)
