import type { omegaIdFields } from './ConfigVars'
import type { UserFiltered } from '@/services/users/Types'

export type OmegaId = Pick<UserFiltered, typeof omegaIdFields[number]>

export type OmegaIdJWT = {
    sub: UserFiltered['id'],
    usrnm: UserFiltered['username'],
    gn: UserFiltered['firstname'],
    sn: UserFiltered['lastname'],
}
