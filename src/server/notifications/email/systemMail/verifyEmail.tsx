import 'server-only'
import { generateJWT } from '@/auth/jwt';
import { UserFiltered } from '@/server/users/Types';
import { render } from '@react-email/render';
import { VerifyEmailTemplate } from '../templates/verifyEmail';
import { sendSystemMail } from '../send';



export async function sendVerifyEmail(user: UserFiltered) {
    const jwt = generateJWT('verifyemail', {
        email: user.email,
        sub: user.id,
    }, 8 * 60 * 60); // 8 hours

    const link = process.env.NODE_ENV === 'development'
        ? `http://localhost/auth/verifyemail?token=${jwt}`
        : `https://${process.env.DOMAIN}/auth/verifyemail?token=${jwt}`
    
    const mailBody = render(<VerifyEmailTemplate user={user} link={link} />)

    await sendSystemMail(user.email, "Bekreft epost", mailBody)
}