import type { AdmissionTrial } from '@prisma/client'
import type { UserFiltered } from '@/services/users/types'

export type ExpandedAdmissionTrail = AdmissionTrial & {
    user: UserFiltered
}
