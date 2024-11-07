import 'server-only'
import { readJWTPart } from './jwtReadUnsecure'
import { JWT_ISSUER } from '@/auth/ConfigVars'
import { ServerError } from '@/services/error'
import { JsonWebTokenError, TokenExpiredError, sign, verify } from 'jsonwebtoken'
import type jwt from 'jsonwebtoken'
import type { JwtPayloadType } from './validation'
import type { OmegaJWTAudience } from '@/auth/Types'


// See https://www.rfc-editor.org/rfc/rfc7519#section-4.1 for the
// JWT payload specification.
export type JWT<T = Record<string, unknown>> = T & JwtPayloadType['Detailed']

/**
 * Generates a JSON Web Token (JWT) with the given payload and expiration time.
 * @param aud - An audience for the token, this is the purpose of the token
 * @param payload - The payload to be included in the JWT.
 * @param expiresIn - The expiration time of the JWT in seconds.
 * @returns The generated JWT.
 */
export function generateJWT<T extends object>(
    aud: OmegaJWTAudience,
    payload: T,
    expiresIn: number,
    asymetric = false
): string {
    if (!process.env.JWT_SECRET || !process.env.JWT_PRIVATE_KEY) {
        throw new ServerError('INVALID CONFIGURATION', 'Missing secret for JWT generation')
    }

    return sign(payload, asymetric ? process.env.JWT_PRIVATE_KEY : process.env.JWT_SECRET, {
        audience: aud,
        algorithm: asymetric ? 'ES256' : 'HS256',
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
    if (!process.env.JWT_SECRET || !process.env.JWT_PUBLIC_KEY) {
        throw new ServerError(
            'INVALID CONFIGURATION',
            'JWT environ variables is not set. Missing JWT_SECRET or JWT_PUBLIC_KEY'
        )
    }

    try {
        const JWTHeader = readJWTPart(token, 0)
        let jwtKey = process.env.JWT_SECRET
        if (JWTHeader.alg === 'ES256') {
            jwtKey = process.env.JWT_PUBLIC_KEY
        }

        const payload = verify(token, jwtKey, {
            issuer: JWT_ISSUER,
            ignoreExpiration: false,
            audience: aud,
        })

        if (typeof payload === 'string') {
            throw new ServerError('JWT INVALID', 'The payload cannot be a string')
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
