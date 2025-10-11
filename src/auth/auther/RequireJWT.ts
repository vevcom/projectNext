import { AutherFactory } from './Auther'
import { verifyJWT } from '@/lib/jwt/jwt'
import { ServerError } from '@/services/error'
import type { OmegaJWTAudience } from '@/lib/jwt/types'

export const RequireJWT = AutherFactory<
    { audience: OmegaJWTAudience },
    { token: string },
    'USER_NOT_REQUIERED_FOR_AUTHORIZED'
>(({ session, staticFields, dynamicFields }) => {
    try {
        verifyJWT(dynamicFields.token, staticFields.audience) // TODO: Verify that it is ok to throw errors
    } catch (err) {
        if (!(err instanceof ServerError)) {
            throw err
        }

        if (!(err.errorCode === 'JWT INVALID' || err.errorCode === 'JWT EXPIRED')) {
            throw err
        }

        return {
            success: false,
            session,
        }
    }

    return {
        success: true,
        session
    }
})
