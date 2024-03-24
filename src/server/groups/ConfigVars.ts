import { GroupType } from "@prisma/client";

/**
 * A object that describes the different group types in a friendly way
 */
export const GroupTypes = {
    OMEGA_MEMBERSHIP_GROUP: {
        name: 'Medlemsgruppe',
        description: 'Grupper som beskriver hvilken tilknytning en bruker har til sct. Omega Broderskab'
    },
    CLASS: {
        name: 'Klasse',
        description: 'Klasse på universitetet'
    },
    STUDY_PROGRAMME: {
        name: 'Studieprogram',
        description: 'Studieprogram på NTNU'
    },
    COMMITTEE: {
        name: 'Komité',
        description: 'Komitér i sct. Omega Broderskab'
    },
    INTEREST_GROUP: {
        name: 'Interessegruppe',
        description: 'Interessegrupper i sct. Omega Broderskab'
    },
    MANUAL_GROUP: {
        name: 'Andre grupper',
        description: 'øvrige grupper'
    }
} as const satisfies { 
    [key in GroupType]: {
        name: string,
        description: string
    } 
}