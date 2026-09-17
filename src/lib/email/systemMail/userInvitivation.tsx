import { generateJWT } from '@/jwt/jwt'
import type { UserFiltered } from '@/services/users/types'
import '@pn-server-only'
import { userInvitationExpiration } from './constants'
import { sendSystemMail } from '@/lib/email/send'
import { UserInvitationTemplate } from '@/lib/email/templates/userInvitation'


export async function sendUserInvitationEmail(user: UserFiltered) {
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
