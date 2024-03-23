import { createSelection } from '@/server/createSelection'
import { User } from '@prisma/client'

export const userFieldsToExpose = ['id', 'username', 'firstname', 'lastname', 'email', 'createdAt', 'updatedAt', 'acceptedTerms'] satisfies (keyof User)[]
export const userFilterSelection = createSelection([...userFieldsToExpose])
