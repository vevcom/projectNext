import 'server-only'
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken"
import { ServerError } from '@/server/error'


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
 * Function for parsing a jwt.
 *
 * @param jwt - The raw jwt.
 * @returns An object containing the jwt payload.
 */
export function readJWTPayload<T = Record<string, unknown>>(jwt: string): JWT<T> {
    const parts = jwt.split('.')
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8')
    return JSON.parse(payload)
}

const JWT_ISSUER = "omegaveven";

/**
 * Generates a JSON Web Token (JWT) with the given payload and expiration time.
 * @param payload - The payload to be included in the JWT.
 * @param expiresIn - The expiration time of the JWT in seconds.
 * @returns The generated JWT.
 */
export function generateJWT<T>(sub: string, payload: T, expiresIn: number): string {
    return jwt.sign({
        sub,
        ait: Math.floor(Date.now() / 1000),
        ...payload
    }, process.env.NEXTAUTH_SECRET ?? "THIS VALUE MUST CHANGE", {
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
export function verifyJWT(token: string) {
    try {
        return jwt.verify(token, process.env.NEXTAUTH_SECRET ?? "THIS VALUE MUST ALSO CHANGE",{
            issuer: JWT_ISSUER,
            ignoreExpiration: false,
        })

    } catch(err) {

        if (err instanceof TokenExpiredError) {
            throw new ServerError('JWT EXPIRED', err.message)
        } else if (err instanceof JsonWebTokenError) {
            throw new ServerError('JWT INVALID', err.message)
        } else {
            throw err;
        }

    }
}