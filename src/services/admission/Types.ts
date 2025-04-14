import type { AdmissionTrial } from '@prisma/client'
import type { UserFiltered } from '@/services/users/Types'

export type ExpandedAdmissionTrail = AdmissionTrial & {
    user: UserFiltered
}
