import 'server-only'
import { resetPasswordValidation } from './validation'
import { ServerError } from '@/server/error'
import { readUser } from '@/server/users/read'
import { verifyJWT } from '@/auth/jwt'
import { sendResetPasswordMail } from '@/server/notifications/email/systemMail/resetPassword'

export async function resetPasswordByEmail(email: string): Promise<string> {
    const parse = resetPasswordValidation.detailedValidate({ email })

    try {
        const user = await readUser({
            email: parse.email,
        })

        await sendResetPasswordMail(user)

        return email
    } catch (e) {
        if (e instanceof ServerError && e.errorCode === 'NOT FOUND') {
            return email
        }
        throw e
    }
}

export async function verifyResetPasswordToken(token: string): Promise<{
    userId: number
}> {
    const payload = verifyJWT(token, 'resetpassword')

    if (payload.sub && payload.iat) {
        const userId = Number(payload.sub)

        const user = await readUser({
            id: userId,
        })

        if (user.updatedAt <= new Date(payload.iat * 1000)) {
            return {
                userId,
            }
        }

        throw new ServerError('JWT INVALID', 'The password has already been changed')
    }

    throw new ServerError('JWT INVALID', 'The forgot password JWT is not valid')
}
