import type { GroupType } from '@prisma/client'

/**
 * This object defines which group types can automatically increase its order
 * when a new omegaOrder is created.
 */
export const AutomaticallyIncreaseOrder = {
    CLASS: true,
    COMMITTEE: false,
    INTEREST_GROUP: true,
    MANUAL_GROUP: false,
    OMEGA_MEMBERSHIP_GROUP: true,
    STUDY_PROGRAMME: true,
} as const satisfies { [K in GroupType]: boolean }
