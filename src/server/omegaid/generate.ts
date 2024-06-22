import 'server-only'
import { OmegaIdExpiryTime } from './ConfigVars'
import type { OmegaId, OmegaIdJWT } from './Types'
import { generateJWT } from '@/jwt/jwt'


export function generateOmegaId(user: OmegaId): string {

    const payload: OmegaIdJWT = {
        sub: user.id,
        usrnm: user.username,
        gn: user.firstname,
        sn: user.lastname,
    }

    return generateJWT('omegaid', payload, OmegaIdExpiryTime, true)
}
