import 'server-only'
import { sendSystemMail } from '@/server/notifications/email/send'
import { ResetPasswordTemplate } from '@/server/notifications/email/templates/resetPassword'
import { generateJWT } from '@/jwt/jwt'
import { readUser } from '@/server/users/read'
import { ServerError } from '@/server/error'
import { emailValidation } from '@/server/notifications/validation'

export async function sendResetPasswordMail(email: string) {

    const parse = emailValidation.detailedValidate({ email })

    try {
        const user = await readUser({
            email: parse.email,
        })

        const jwt = generateJWT('resetpassword', {
            sub: user.id,
        }, 60 * 60)
    
        const link = `${process.env.NEXTAUTH_URL}/auth/resetpassword?token=${jwt}`
    
        await sendSystemMail(user.email, 'Glemt passord', <ResetPasswordTemplate user={user} link={link} />)

        return email
    } catch (e) {
        if (e instanceof ServerError && e.errorCode === 'NOT FOUND') {
            return email
        }
        throw e
    }
}
