import type { AdmissionTrial } from '@/prisma-generated-pn-types'
import type { UserFiltered } from '@/services/users/types'

export type ExpandedAdmissionTrail = AdmissionTrial & {
    user: UserFiltered
}
