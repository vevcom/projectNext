import { RequireJWT } from '@/auth/auther/RequireJWT'
import { RequireNothing } from '@/auth/auther/RequireNothing'

export namespace AuthAuthers {
    export const verifyEmail = RequireJWT.staticFields({ audience: 'verifyemail' })
    export const resetPassword = RequireJWT.staticFields({ audience: 'resetpassword' })
    export const sendResetPasswordEmail = RequireNothing.staticFields({})
}
