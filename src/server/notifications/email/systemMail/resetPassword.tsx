import 'server-only'
import { generateJWT } from '@/auth/jwt'
import { render } from '@react-email/render'
import { sendSystemMail } from '../send'
import { UserFiltered } from '@/server/users/Types'
import { ResetPasswordTemplate } from '../templates/resetPassword'


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