import type { GroupType, OmegaMembershipLevel, Prisma } from '@/prisma-generated-pn-types'
import type { GroupTypeInfo } from './types'

/**
 * A object that describes the different group types in a friendly way
 */
export const groupTypesConfig = {
    OMEGA_MEMBERSHIP_GROUP: {
        name: 'Medlemsgruppe',
        namePlural: 'Medlemsgrupper',
        description: 'Grupper som beskriver hvilken tilknytning en bruker har til sct. Omega Broderskab'
    },
    CLASS: {
        name: 'Klasse',
        namePlural: 'Klasser',
        description: 'Klasse på universitetet'
    },
    STUDY_PROGRAMME: {
        name: 'Studieprogram',
        namePlural: 'Studieprogrammer',
        description: 'Studieprogram på NTNU'
    },
    COMMITTEE: {
        name: 'Komité',
        namePlural: 'Komitéer',
        description: 'Komitér i sct. Omega Broderskab'
    },
    INTEREST_GROUP: {
        name: 'Interessegruppe',
        namePlural: 'Interessegrupper',
        description: 'Interessegrupper i sct. Omega Broderskab'
    },
    MANUAL_GROUP: {
        name: 'Andre grupper',
        namePlural: 'Andre grupper',
        description: 'øvrige grupper'
    }
} as const satisfies {
    [key in GroupType]: GroupTypeInfo
}

export const GroupTypeOrdering: string[] = ['OMEGA_MEMBERSHIP_GROUP', 'CLASS', 'STUDY_PROGRAMME',
    'COMMITTEE', 'INTEREST_GROUP', 'MANUAL_GROUP'] satisfies GroupType[]

export const OmegaMembershipLevelConfig = {
    SOELLE: {
        name: 'Solle noice',
        description: 'Avsky!'
    },
    MEMBER: {
        name: 'Medlem',
        description: 'Broder udaf sct. Omega Broderskab'
    },
    EXTERNAL: {
        name: 'Eksterne',
        description: 'Ekstern bruker ikke i omega'
    }
} as const satisfies {
    [key in OmegaMembershipLevel]: {
        name: string,
        description: string
    }
}

export const OMEGA_MEMBERSHIP_LEVEL_RANKING: OmegaMembershipLevel[] = [
    'EXTERNAL',
    'SOELLE',
    'MEMBER',
]

export const groupsWithRelationsIncluder = {
    committee: { select: { name: true } },
    manualGroup: { select: { name: true } },
    class: { select: { year: true } },
    interestGroup: { select: { name: true } },
    omegaMembershipGroup: { select: { omegaMembershipLevel: true } },
    studyProgramme: { select: { name: true } },
} as const satisfies Prisma.GroupInclude

export const groupsExpandedIncluder = {
    ...groupsWithRelationsIncluder,
    memberships: {
        take: 1,
        orderBy: {
            order: 'asc'
        },
        select: {
            order: true
        }
    },
} as const satisfies Prisma.GroupInclude

export const readGroupsOfUserIncluder = {
    class: true,
    committee: true,
    interestGroup: true,
    manualGroup: true,
    omegaMembershipGroup: true,
    studyProgramme: true,

} as const satisfies Prisma.GroupInclude
