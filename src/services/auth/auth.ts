import { RequireJWT } from '@/auth/auther/RequireJWT'
import { RequireNothing } from '@/auth/auther/RequireNothing'

// TODO: A better name lol
export const authAuth = {
    verifyEmail: RequireJWT.staticFields({ audience: 'verifyemail' }),
    resetPassword: RequireJWT.staticFields({ audience: 'resetpassword' }),
    sendResetPasswordEmail: RequireNothing.staticFields({}),
}
