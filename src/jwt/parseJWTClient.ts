'use client'

import { readJWTPayload } from './jwtReadUnsecure'
import { JWT_ISSUER } from '@/auth/ConfigVars'
import type { OmegaJWTAudience } from '@/auth/Types'
import type { ActionReturn } from '@/actions/Types'
import type { OmegaId } from '@/services/omegaid/Types'

/**
 * Parses a JSON Web Token (JWT) and verifies its signature using the provided public key.
 * WARNING: This function should only be used at the client, and never at the server
 * @param token - The JWT to parse and verify.
 * @param publicKey - The public key used to verify the JWT signature.
 * @param timeOffset - The time offset in milliseconds to account for clock differences.
 * @param audience - Optional check that he audience is correct
 * @returns A promise that resolves to an `ActionReturn` object containing the parsed JWT payload if the JWT is valid,
 * or an error object if the JWT is invalid.
 */
export async function parseJWT(token: string, publicKey: string, timeOffset: number, audience?: OmegaJWTAudience): Promise<ActionReturn<OmegaId>> {
    // TODO: This only works in safari and firefox :///

    function invalidJWT(message?: string): ActionReturn<OmegaId> {
        return {
            success: false,
            errorCode: 'JWT INVALID',
            error: message ? [{
                message
            }] : []
        }
    }

    if (timeOffset < 0) {
        throw new Error('The timeOffset cannot be below 0')
    }


    const tokenS = token.split('.')
    if (tokenS.length !== 3) {
        return invalidJWT('Ugyldig QR kode type')
    }

    const keyStripped = publicKey
        .replaceAll('\n', '')
        .replace('-----BEGIN PUBLIC KEY-----', '')
        .replace('-----END PUBLIC KEY-----', '')
        .trim()

    const key = await crypto.subtle.importKey(
        'spki', // Subject Public Key Info
        Buffer.from(keyStripped, 'base64'),
        {
            name: 'ECDSA',
            namedCurve: 'P-256',
        },
        true,
        ['verify']
    )

    const signValid = await crypto.subtle.verify(
        {
            name: 'ECDSA',
            hash: 'SHA-256'
        },
        key,
        Buffer.from(tokenS[2], 'base64'),
        Buffer.from(`${tokenS[0]}.${tokenS[1]}`),
    )


    if (!signValid) {
        return invalidJWT('Invalid JWT signature')
    }

    try {
        const payload = readJWTPayload(token)

        if (!(
            typeof payload.sub === 'number'
        )) {
            return invalidJWT('Invalid fields')
        }

        if (new Date(payload.exp * 1000 + timeOffset) < new Date()) {
            return invalidJWT('The JWT is expired')
        }

        if (payload.iss !== JWT_ISSUER) {
            return invalidJWT('Invalid issuer')
        }

        if (audience && payload.aud !== audience) {
            return invalidJWT('Invalid audience')
        }

        return {
            success: true,
            data: {
                id: payload.sub,
            }
        }
    } catch {
        return invalidJWT('An unexpected error occured')
    }
}
