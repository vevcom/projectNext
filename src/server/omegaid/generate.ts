import 'server-only'
import { OmegaId, OmegaIdJWT } from './Types';
import jwt from 'jsonwebtoken';
import { ServerError } from '../error';
import { OmegaJWTAudience } from '@/auth/Types';
import { JWT_ISSUER } from '@/auth/ConfigVars';
import { OmegaIdExpiryTime } from './ConfigVars';



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