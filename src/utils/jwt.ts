
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