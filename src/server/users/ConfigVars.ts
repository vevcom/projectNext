import { createSelection } from '@/server/createSelection'
import type { SEX, User } from '@prisma/client'

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

export const userFilterSelection = createSelection([...userFieldsToExpose])
