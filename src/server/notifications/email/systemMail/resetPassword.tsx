import 'server-only'
import { sendSystemMail } from '@/server/notifications/email/send'
import { ResetPasswordTemplate } from '@/server/notifications/email/templates/resetPassword'
import { generateJWT } from '@/auth/jwt'
import type { UserFiltered } from '@/server/users/Types'


export async function sendResetPasswordMail(user: UserFiltered) {
    const jwt = generateJWT('resetpassword', {
        sub: user.id,
    }, 60 * 60)

    const link = `${process.env.NEXTAUTH_URL}/auth/resetpassword?token=${jwt}`

    await sendSystemMail(user.email, 'Glemt passord', <ResetPasswordTemplate user={user} link={link} />)
}
