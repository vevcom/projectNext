import 'server-only'
import { VerifyEmailTemplate } from '@/server/notifications/email/templates/verifyEmail'
import { sendSystemMail } from '@/server/notifications/email/send'
import { generateJWT } from '@/auth/jwt'
import { verifyEmailValidation } from '@/server/users/validation'
import type { UserFiltered } from '@/server/users/Types'
import { emailValidationExpiration } from './ConfigVars'


export async function sendVerifyEmail(user: UserFiltered, email: string) {
    const parse = verifyEmailValidation.detailedValidate({ email })

    const jwt = generateJWT('verifyemail', {
        email: parse.email,
        sub: user.id,
    }, emailValidationExpiration)

    const link = `${process.env.NEXTAUTH_URL}/register?token=${jwt}`

    await sendSystemMail(user.email, 'Bekreft e-post', <VerifyEmailTemplate user={user} link={link} />)
}
