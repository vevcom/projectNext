import 'server-only'
import { OmegaIdExpiryTime } from './ConfigVars'
import { generateJWT } from '@/jwt/jwt'
import type { OmegaId, OmegaIdJWT } from './Types'


export function generateOmegaId(user: OmegaId): string {
    const payload: OmegaIdJWT = {
        sub: user.id,
        usrnm: user.username,
        gn: user.firstname,
        sn: user.lastname,
    }

    return generateJWT('omegaid', payload, OmegaIdExpiryTime, true)
}
