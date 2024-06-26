import type { GroupType } from '@prisma/client'

/**
 * This object defines which group types can easily create memberships, by calling createMembership
 * function. Some group group types have special sytems to change/create memberships, and they are
 * - CLASS: Use class bump system or TODO: add function to change class memberships
 * - OMEGA_MEMBERSHIP_GROUP: use the admition system
 */
export const CanEasilyManageMembership = {
    CLASS: false,
    COMMITTEE: true,
    INTEREST_GROUP: true,
    MANUAL_GROUP: true,
    OMEGA_MEMBERSHIP_GROUP: false,
    STUDY_PROGRAMME: true,
} satisfies { [K in GroupType]: boolean }
