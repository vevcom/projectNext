import 'server-only'
import { OmegaIdExpiryTime } from './ConfigVars'
import { ServerError } from '@/server/error'
import { JWT_ISSUER } from '@/auth/ConfigVars'
import jwt from 'jsonwebtoken'
import type { OmegaId, OmegaIdJWT } from './Types'
import type { OmegaJWTAudience } from '@/auth/Types'


export function generateOmegaId(data: OmegaId): string {
    // TODO: validate data

    const privKey = process.env.OMEGAID_PRIVATE_KEY
    if (!privKey) {
        throw new ServerError('INVALID CONFIGURATION', 'The environvariable OMEGAID_PRIVATE_KEY must be set')
    }

    const payload: OmegaIdJWT = {
        sub: data.id,
        usrnm: data.username,
        gn: data.firstname,
        sn: data.lastname,
    }

    const token = jwt.sign(payload, privKey, {
        algorithm: 'ES256',
        audience: 'omegaid' satisfies OmegaJWTAudience,
        issuer: JWT_ISSUER,
        expiresIn: OmegaIdExpiryTime,
    })

    return token
}
