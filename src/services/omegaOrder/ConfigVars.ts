import type { GroupType } from '@/prisma-generated-pn-types'

/**
 * This object defines which group types can automatically increase their order
 * when a new omegaOrder is created.
 */
export const AutomaticallyIncreaseOrder = {
    CLASS: false,
    COMMITTEE: false,
    INTEREST_GROUP: true,
    MANUAL_GROUP: false,
    OMEGA_MEMBERSHIP_GROUP: true,
    STUDY_PROGRAMME: true,
} as const satisfies { [K in GroupType]: boolean }
