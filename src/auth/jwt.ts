import 'server-only'
import { JWT_ISSUER } from './ConfigVars'
import { ServerError } from '@/server/error'
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'
import type { OmegaJWTAudience } from './Types'


// See https://www.rfc-editor.org/rfc/rfc7519#section-4.1 for the
// JWT payload specification.
export type JWT<T = Record<string, unknown>> = T & {
    iss: string,
    jti: string,
    aud: string,
    sub: string,
    iat: number,
    exp: number,
}

/**
 * Generates a JSON Web Token (JWT) with the given payload and expiration time.
 * @param payload - The payload to be included in the JWT.
 * @param expiresIn - The expiration time of the JWT in seconds.
 * @returns The generated JWT.
 */
export function generateJWT<T>(aud: OmegaJWTAudience, payload: T, expiresIn: number): string {
    return jwt.sign({
        aud,
        ait: Math.floor(Date.now() / 1000),
        ...payload
    }, process.env.NEXTAUTH_SECRET ?? 'THIS VALUE MUST CHANGE', {
        issuer: JWT_ISSUER,
        expiresIn,
    })
}

/**
 * Verifies the authenticity of a JSON Web Token (JWT).
 * @param token - The JWT to be verified.
 * @returns The decoded payload of the JWT if it is valid.
 * @throws {ServerError} If the JWT is expired or invalid.
 */
export function verifyJWT(token: string, aud?: OmegaJWTAudience): (jwt.JwtPayload & Record<string, string | number | null>) {
    try {
        const payload = jwt.verify(token, process.env.NEXTAUTH_SECRET ?? 'THIS VALUE MUST ALSO CHANGE', {
            issuer: JWT_ISSUER,
            ignoreExpiration: false,
        })

        if (typeof payload === 'string') {
            throw new ServerError('JWT INVALID', 'The payload cannot be a string')
        }

        if (aud && typeof payload !== 'string' && payload.aud !== aud) {
            throw new ServerError('JWT INVALID', 'The audience in the jwt does not match!')
        }

        return payload
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            throw new ServerError('JWT EXPIRED', err.message)
        } else if (err instanceof JsonWebTokenError) {
            throw new ServerError('JWT INVALID', err.message)
        } else {
            throw err
        }
    }
}
