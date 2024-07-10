import { createSelection } from '@/server/createSelection'
import type { Prisma, User, SEX } from '@prisma/client'

export const maxNumberOfGroupsInFilter = 7

export const userFieldsToExpose = [
    'id',
    'username',
    'firstname',
    'lastname',
    'email',
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
    },
    FEMALE: {
        title: 'Syster',
        pronoun: 'Hendes',
    },
    OTHER: {
        title: 'Søsken',
        pronoun: 'Hends',
    }
} as const satisfies { [key in SEX]: { title: string, pronoun: string }}
