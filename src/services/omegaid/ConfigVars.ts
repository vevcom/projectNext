import type { UserFiltered } from '@/server/users/Types'


export const omegaIdFields = [
    'id',
    'firstname',
    'lastname',
    'username',
] as const satisfies (keyof UserFiltered)[]

export const OmegaIdExpiryTime = 60 * 5 // 5 minutes
