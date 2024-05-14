import 'server-only'
import { sendSystemMail } from '@/server/notifications/email/send'
import { ResetPasswordTemplate } from '@/server/notifications/email/templates/resetPassword'
import { generateJWT } from '@/auth/jwt'
import { render } from '@react-email/render'
import type { UserFiltered } from '@/server/users/Types'


export async function sendResetPasswordMail(user: UserFiltered) {
    const jwt = generateJWT('resetpassword', {
        sub: user.id,
    }, 60 * 60)

    const link = process.env.NODE_ENV === 'development'
        ? `http://localhost/auth/resetpassword?token=${jwt}`
        : `https://${process.env.DOMAIN}/auth/resetpassword?token=${jwt}`

    const mailBody = render(<ResetPasswordTemplate user={user} link={link} />)

    await sendSystemMail(user.email, 'Glemt passord', mailBody)
}
