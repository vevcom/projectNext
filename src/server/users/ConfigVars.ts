import { createSelection } from '@/server/createSelection'
import type { SEX, User } from '@prisma/client'

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

export const sexOptions = [
    { value: 'FEMALE', label: 'Kvinne' },
    { value: 'MALE', label: 'Mann' },
    { value: 'OTHER', label: 'Annet' },
] satisfies {
    value: SEX,
    label: string,
}[]
