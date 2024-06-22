import type { JWT } from './jwt'

/** Function for parsing a jwt.
 * WARNING! This function does not validate the signature!
 *
 * @param jwtString - The raw jwt.
 * @returns An object containing the jwt payload.
 */
export function readJWTPayload<T = Record<string, unknown>>(jwtString: string): JWT<T> {
    const payload = readJWTPart(jwtString, 1)
    
    if (!(
        payload &&
        typeof(payload) === 'object' &&
        typeof(payload.iss) === 'string' &&
        typeof(payload.aud) === 'string' &&
        typeof(payload.sub) === 'number' &&
        typeof(payload.iat) === 'number' &&
        typeof(payload.exp) === 'number'
    )) {
        throw new Error("Invalid JWT string")
    }

    return payload
}


/**
 * Reads a specific part of a JSON Web Token (JWT) string.
 * WARNING: This function does not validate the signature
 * 
 * @param jwtString - The JWT string to read from.
 * @param part - The part of the JWT to read. Default is 1 (payload).
 * @returns The parsed JSON object of the specified JWT part.
 */
export function readJWTPart(jwtString: string, part: 0 | 1 | 2 = 1) {
    const parts = jwtString.split('.')
    const payload = Buffer.from(parts[part], 'base64').toString('utf-8')
    return JSON.parse(payload)
}

