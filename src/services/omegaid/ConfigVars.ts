import type { UserFiltered } from '@/services/users/Types'


export const omegaIdFields = [
    'id',
    'firstname',
    'lastname',
    'username',
] as const satisfies (keyof UserFiltered)[]

export const OmegaIdExpiryTime = 60 * 5 // 5 minutes
