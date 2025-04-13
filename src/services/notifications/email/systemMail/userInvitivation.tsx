import 'server-only'
import { userInvitationExpiration } from './ConfigVars'
import { generateJWT } from '@/jwt/jwt'
import { sendSystemMail } from '@/services/notifications/email/send'
import { UserInvitationTemplate } from '@/services/notifications/email/templates/userInvitation'
import type { UserContactInfoFiltered } from '@/services/users/Types'

export async function sendUserInvitationEmail(user: UserContactInfoFiltered) {
    const jwt = generateJWT('verifyemail', {
        sub: user.id,
        email: user.email,
    }, userInvitationExpiration)

    const link = `${process.env.SERVER_LINK_PREFIX}/verify-email?token=${jwt}`

    await sendSystemMail(
        user.email,
        `Invitasjon til ${process.env.DOMAIN}`,
        <UserInvitationTemplate user={user} link={link} />
    )
}
