import { createSelection } from '@/services/createSelection'
import type { Prisma, User, SEX } from '@prisma/client'

export namespace UserConfig {
    export const maxNumberOfGroupsInFilter = 7
    export const studentCardRegistrationExpiry = 2 // minutter

    // TODO: This needs to be divived into seperate filters, depending on how much information is needed
    export const fieldsToExpose = [
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
        'allergies',
    ] as const satisfies (keyof User)[]

    export const filterSelection = createSelection([...fieldsToExpose])

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
}
