import type { Group, GroupType, OmegaMembershipLevel } from '@prisma/client'

/**
 * Type used to be able to infer the extra fields in ExpandedGroup
 */
export type GroupWithIncludes = Group & {
    committee?: { name: string } | null,
    manualGroup?: { name: string } | null,
    class?: { year: number } | null,
    interestGroup?: { name: string } | null,
    omegaMembershipGroup?: { omegaMembershipLevel: OmegaMembershipLevel } | null,
    studyProgramme?: { name: string } | null,
    memberships: { order: number }[]
}

/**
 * Type including extra infered fields based on the type of group and the group data
 */
export type ExpandedGroup = Group & {
    firstOrder: number
    name: string
    members: number
}

export type GroupsStructured = {
    [key in GroupType]: {
        name: string,
        description: string,
        groups: ExpandedGroup[]
    }
}
