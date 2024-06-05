'use client'

import { JWT_ISSUER } from '@/auth/ConfigVars'
import type { JWT } from '@/auth/jwt'
import type { OmegaJWTAudience } from '@/auth/Types'
import type { ActionReturn } from '@/actions/Types'
import type { OmegaId, OmegaIdJWT } from '@/server/omegaid/Types'

export async function parseJWT(token: string, publicKey: string, timeOffset: number): Promise<ActionReturn<OmegaId>> {
    // TODO: This only works in safari :///

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

    const payload = JSON.parse(
        Buffer.from(tokenS[1], 'base64').toString('utf-8')
    ) as OmegaIdJWT & JWT

    if (
        !payload.exp ||
        !payload.iss ||
        !payload.aud ||
        !payload.sub ||
        !payload.usrnm ||
        !payload.sn ||
        !payload.gn
    ) {
        return invalidJWT('Missing mandatory fields')
    }

    if (new Date(payload.exp * 1000 + timeOffset) < new Date()) {
        return invalidJWT('QR koden er utløpt')
    }

    if (payload.iss !== JWT_ISSUER) {
        return invalidJWT('Invalid issuer')
    }

    if (payload.aud !== 'omegaid' satisfies OmegaJWTAudience) {
        return invalidJWT('Invalid audience')
    }

    return {
        success: true,
        data: {
            id: payload.sub,
            username: payload.usrnm,
            firstname: payload.gn,
            lastname: payload.sn,
        }
    }
}
