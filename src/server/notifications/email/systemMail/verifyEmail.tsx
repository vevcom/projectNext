import 'server-only'
import { emailValidationExpiration } from './ConfigVars'
import { VerifyEmailTemplate } from '@/server/notifications/email/templates/verifyEmail'
import { sendSystemMail } from '@/server/notifications/email/send'
import { generateJWT } from '@/jwt/jwt'
import { verifyEmailValidation } from '@/server/users/validation'
import type { UserFiltered } from '@/server/users/Types'


export async function sendVerifyEmail(user: UserFiltered, email: string) {
    const parse = verifyEmailValidation.detailedValidate({ email })

    const jwt = generateJWT('verifyemail', {
        email: parse.email,
        sub: user.id,
    }, emailValidationExpiration)

    const link = `${process.env.DOMAIN}/register?token=${jwt}`

    await sendSystemMail(user.email, 'Bekreft e-post', <VerifyEmailTemplate user={user} link={link} />)
}
