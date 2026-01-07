import { RequireJWT } from '@/auth/authorizer/RequireJWT'
import { RequireNothing } from '@/auth/authorizer/RequireNothing'

// TODO: A better name lol
export const authAuth = {
    verifyEmail: RequireJWT.staticFields({ audience: 'verifyemail' }),
    resetPassword: RequireJWT.staticFields({ audience: 'resetpassword' }),
    sendResetPasswordEmail: RequireNothing.staticFields({}),
}
