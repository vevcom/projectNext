import 'server-only'
import { sendSystemMail } from '@/services/notifications/email/send'
import { ResetPasswordTemplate } from '@/services/notifications/email/templates/resetPassword'
import { generateJWT } from '@/jwt/jwt'
import { readUser } from '@/services/users/read'
import { ServerError } from '@/services/error'
import { emailValidation } from '@/services/notifications/validation'

export async function sendResetPasswordMail(email: string) {
    const parse = emailValidation.detailedValidate({ email })

    try {
        const user = await readUser({
            email: parse.email,
        })

        const jwt = generateJWT('resetpassword', {
            sub: user.id,
        }, 60 * 60)

        const link = `${process.env.DOMAIN}/auth/reset-password?token=${jwt}`

        await sendSystemMail(user.email, 'Glemt passord', <ResetPasswordTemplate user={user} link={link} />)

        return email
    } catch (e) {
        if (e instanceof ServerError && e.errorCode === 'NOT FOUND') {
            return email
        }
        throw e
    }
}
