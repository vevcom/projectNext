import { generateJWT } from '@/jwt/jwt'
import type { UserFiltered } from '@/server/users/Types'
import 'server-only'
import { userInvitationExpiration } from './ConfigVars'
import { sendSystemMail } from '@/server/notifications/email/send'
import { UserInvitationTemplate } from '@/server/notifications/email/templates/userInvitation'


export async function sendUserInvitationEmail(user: UserFiltered) {
    const jwt = generateJWT('verifyemail', {
        sub: user.id,
        email: user.email,
    }, userInvitationExpiration)

    const link = `${process.env.NEXTAUTH_URL}/register?token=${jwt}`

    await sendSystemMail(
        user.email,
        `Invitasjon til ${process.env.DOMAIN}`,
        <UserInvitationTemplate user={user} link={link} />
    )
}
