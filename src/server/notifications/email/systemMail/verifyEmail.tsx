import 'server-only'
import { VerifyEmailTemplate } from '@/server/notifications/email/templates/verifyEmail'
import { sendSystemMail } from '@/server/notifications/email/send'
import { generateJWT } from '@/auth/jwt'
import { verifyEmailValidation } from '@/server/users/validation'
import { render } from '@react-email/render'
import type { UserFiltered } from '@/server/users/Types'


export async function sendVerifyEmail(user: UserFiltered, email: string) {
    const parse = verifyEmailValidation.detailedValidate({ email })

    const jwt = generateJWT('verifyemail', {
        email: parse.email,
        sub: user.id,
    }, 8 * 60 * 60) // 8 hours

    const link = process.env.NODE_ENV === 'development'
        ? `http://localhost/register?token=${jwt}`
        : `https://${process.env.DOMAIN}/register?token=${jwt}`

    const mailBody = render(<VerifyEmailTemplate user={user} link={link} />)

    await sendSystemMail(user.email, 'Bekreft epost', mailBody)
}
