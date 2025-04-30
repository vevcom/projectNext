import { createSelection } from '@/services/createSelection'
import type { Prisma, User, SEX } from '@prisma/client'

export namespace UserConfig {
    export const maxNumberOfGroupsInFilter = 7
    export const studentCardRegistrationExpiry = 2 // minutter

    export const exposeName = [
        'id',
        'username',
        'firstname',
        'lastname'
    ] as const satisfies (keyof User)[]
    export const filterNameSelection = createSelection([...exposeName])

    export const exposeContactInfo = [
        ...exposeName,
        'email',
        'mobile',
    ] as const satisfies (keyof User)[]
    export const filterContactInfoSelection = createSelection([...exposeContactInfo])

    export const exposeProfile = [
        ...exposeContactInfo,
        'sex',
        'bio',
        'imageId',
    ] as const satisfies (keyof User)[]
    export const filterProfileSelection = {
        ...createSelection([...exposeProfile]),
        image: true,
    } as const

    // The auth is what is exposed to the user in the session
    export const exposeAuth = [
        ...exposeContactInfo,
        'sex',
        'emailVerified',
        'acceptedTerms',
        'updatedAt',
    ] as const satisfies (keyof User)[]
    export const filterAuthSelection = createSelection([...exposeAuth])

    export const exposeAll = [
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
        'imageId',
        'studentCard',
    ] as const satisfies (keyof User)[]
    export const filterAllSelection = createSelection([...exposeAll])

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
