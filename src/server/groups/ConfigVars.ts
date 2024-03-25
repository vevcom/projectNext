import type { GroupType, OmegaMembershipLevel } from '@prisma/client'

/**
 * A object that describes the different group types in a friendly way
 */
export const GroupTypesConfig = {
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
    [key in GroupType]: {
        name: string,
        namePlural: string,
        description: string
    }
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
