import { createSelection } from '@/server/createSelection'
import type { Prisma, User } from '@prisma/client'

export const maxNumberOfGroupsInFilter = 7

export const userFieldsToExpose = [
    'id',
    'username',
    'firstname',
    'lastname',
    'email',
    'createdAt',
    'updatedAt',
    'acceptedTerms'
] satisfies (keyof User)[]
export const userFilterSelection = createSelection([...userFieldsToExpose])
