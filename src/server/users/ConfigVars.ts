import { createSelection } from '@/server/createSelection'
import type { User } from '@prisma/client'

export const userFieldsToExpose = [
    'id',
    'username',
    'firstname',
    'lastname',
    'email',
    'createdAt',
    'updatedAt',
] as const satisfies (keyof User)[]
export const userFilterSelection = createSelection([...userFieldsToExpose])
