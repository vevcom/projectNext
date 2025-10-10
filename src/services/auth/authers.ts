import { RequireJWT } from '@/auth/auther/RequireJWT'
import { RequireNothing } from '@/auth/auther/RequireNothing'

export const authAuthers = {
    verifyEmail: RequireJWT.staticFields({ audience: 'verifyemail' }),
    resetPassword: RequireJWT.staticFields({ audience: 'resetpassword' }),
    sendResetPasswordEmail: RequireNothing.staticFields({}),
}
