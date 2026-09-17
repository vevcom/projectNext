import type { UserFiltered } from '@/services/users/types'

export type OmegaIdJWT = {
    iat: number,
    exp: number,
    sub: UserFiltered['id'],
}
