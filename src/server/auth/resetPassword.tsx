import 'server-only'
import { resetPasswordValidation } from './validation'
import { ServerError } from '@/server/error'
import { readUser } from '@/server/users/read'
import { sendSystemMail } from '@/server/notifications/email/send'
import { ResetPasswordTemplate } from '@/server/notifications/email/templates/resetPassword'
import { generateJWT, verifyJWT } from '@/auth/jwt'
import { render } from '@react-email/render'
import type { UserFiltered } from '@/server/users/Types'

export async function resetPasswordByEmail(email: string): Promise<string> {
    const parse = resetPasswordValidation.detailedValidate({ email })

    try {
        const user = await readUser({
            email: parse.email,
        })

        await resetPassword(user)

        return email
    } catch (e) {
        if (e instanceof ServerError && e.errorCode === 'NOT FOUND') {
            return email
        }
        throw e
    }
}

export async function resetPassword(user: UserFiltered) {
    const jwt = generateJWT('resetpassword', {
        sub: user.id,
        lastUpdate: user.updatedAt,
    }, 60 * 60)

    const link = process.env.NODE_ENV === 'development'
        ? `http://localhost/auth/resetpassword?token=${jwt}`
        : `https://${process.env.DOMAIN}/auth/resetpassword?token=${jwt}`

    const mailBody = render(<ResetPasswordTemplate user={user} link={link} />)

    await sendSystemMail(user.email, 'Glemt passord', mailBody)
}

export async function verifyResetPasswordToken(token: string): Promise<{
    userId: number
}> {
    const payload = verifyJWT(token, 'resetpassword')

    if (payload.sub && payload.lastUpdate) {
        const userId = Number(payload.sub)

        const user = await readUser({
            id: userId,
        })

        if (user.updatedAt <= new Date(payload.lastUpdate)) {
            return {
                userId,
            }
        }

        throw new ServerError('JWT INVALID', 'The password has already been changed')
    }

    throw new ServerError('JWT INVALID', 'The forgot password JWT is not valid')
}
