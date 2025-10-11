import type { UserFiltered } from '@/services/users/types'

export type OmegaId = Pick<UserFiltered, 'id'>

export type OmegaIdJWT = {
    iat: number,
    exp: number,
    sub: UserFiltered['id'],
}
