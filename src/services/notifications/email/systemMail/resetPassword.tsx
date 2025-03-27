import 'server-only'
import { sendSystemMail } from '@/services/notifications/email/send'
import { ResetPasswordTemplate } from '@/services/notifications/email/templates/resetPassword'
import { generateJWT } from '@/jwt/jwt'
import { UserMethods } from '@/services/users/methods'
import { ServerError } from '@/services/error'
import { emailValidation } from '@/services/notifications/validation'

export async function sendResetPasswordMail(email: string) {
    const parse = emailValidation.detailedValidate({ email })

    try {
        const user = await UserMethods.read.newClient().execute({
            params: { email: parse.email },
            session: null,
            bypassAuth: true,
        })

        const jwt = generateJWT('resetpassword', {
            sub: user.id,
        }, 60 * 60)

        const link = `${process.env.SERVER_LINK_PREFIX}/reset-password-form?token=${jwt}`

        await sendSystemMail(user.email, 'Glemt passord', <ResetPasswordTemplate user={user} link={link} />)

        return email
    } catch (e) {
        if (e instanceof ServerError && e.errorCode === 'NOT FOUND') {
            return email
        }
        throw e
    }
}
