import { createSelection } from '@/services/createSelection'
import type { Prisma, User, SEX } from '@prisma/client'

export const maxNumberOfGroupsInFilter = 7

export const userFieldsToExpose = [
    'id',
    'username',
    'firstname',
    'lastname',
    'email',
    'emailVerified',
    'mobile',
    'createdAt',
    'updatedAt',
    'acceptedTerms',
    'sex',
] as const satisfies (keyof User)[]

export const userFilterSelection = createSelection([...userFieldsToExpose])

export const standardMembershipSelection = [
    {
        group: {
            groupType: 'CLASS'
        }
    },
    {
        group: {
            groupType: 'OMEGA_MEMBERSHIP_GROUP'
        }
    },
    {
        group: {
            groupType: 'STUDY_PROGRAMME'
        }
    },
] satisfies Prisma.MembershipWhereInput[]


export const sexConfig = {
    MALE: {
        title: 'Broder',
        pronoun: 'Hands',
        label: 'Mann',
    },
    FEMALE: {
        title: 'Syster',
        pronoun: 'Hendes',
        label: 'Kvinne',
    },
    OTHER: {
        title: 'Søsken',
        pronoun: 'Hends',
        label: 'Annet',
    }
} as const satisfies { [key in SEX]: { title: string, pronoun: string, label: string } }
