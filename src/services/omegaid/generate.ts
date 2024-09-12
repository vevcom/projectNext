import 'server-only'
import { OmegaIdExpiryTime } from './ConfigVars'
import { generateJWT } from '@/jwt/jwt'
import type { OmegaId, OmegaIdJWT } from './Types'


export function generateOmegaId(user: OmegaId): string {
    const payload = {
        sub: user.id,
    }

    return generateJWT('omegaid', payload, OmegaIdExpiryTime, true)
}
