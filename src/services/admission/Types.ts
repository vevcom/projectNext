import type { AdmissionTrial } from '@prisma/client'
import type { UserNameFiltered } from '@/services/users/Types'

export type ExpandedAdmissionTrail = AdmissionTrial & {
    user: UserNameFiltered
}
