import type { JWT } from "./jwt"

/** Function for parsing a jwt.
 *
 * @param jwtString - The raw jwt.
 * @returns An object containing the jwt payload.
 */
export function readJWTPayload<T = Record<string, unknown>>(jwtString: string): JWT<T> {
    const parts = jwtString.split('.')
    const payload = Buffer.from(parts[1], 'base64').toString('utf-8')
    return JSON.parse(payload)
}