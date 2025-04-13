import 'server-only'
import { emailValidationExpiration } from './ConfigVars'
import { VerifyEmailTemplate } from '@/services/notifications/email/templates/verifyEmail'
import { sendSystemMail } from '@/services/notifications/email/send'
import { generateJWT } from '@/jwt/jwt'
import { UserSchemas } from '@/services/users/schemas'
import type { UserContactInfoFiltered } from '@/services/users/Types'

// TODO: Fix this with new validation
export async function sendVerifyEmail(user: UserContactInfoFiltered, email: string) {
    const parse = UserSchemas.verifyEmail.parse({ email })

    const jwt = generateJWT('verifyemail', {
        email: parse.email,
        sub: user.id,
    }, emailValidationExpiration)

    const link = `${process.env.SERVER_LINK_PREFIX}/verify-email?token=${jwt}`

    await sendSystemMail(parse.email, 'Bekreft e-post', <VerifyEmailTemplate user={user} link={link} />)
}
