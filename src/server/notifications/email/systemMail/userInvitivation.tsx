import { generateJWT } from '@/auth/jwt';
import { UserFiltered } from '@/server/users/Types';
import 'server-only'
import { userInvitationExpiration } from './ConfigVars';
import { sendSystemMail } from '../send';
import { UserInvitationTemplate } from '../templates/userInvitation';



export async function sendUserInvitationEmail(user: UserFiltered) {
    const jwt = generateJWT('verifyemail', {
        sub: user.id,
        email: user.email,
    }, userInvitationExpiration)

    const link = process.env.NODE_ENV === 'development'
        ? `http://localhost/register?token=${jwt}`
        : `https://${process.env.DOMAIN}/register?token=${jwt}`

    await sendSystemMail(user.email, `Invitasjon til ${process.env.DOMAIN}`, <UserInvitationTemplate user={user} link={link} />)
}