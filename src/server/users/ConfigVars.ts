import { createSelection } from '@/server/createSelection'

export const userFieldsToExpose = ['id', 'username', 'firstname', 'lastname', 'email', 'createdAt', 'updatedAt'] as const
export const userFilterSelection = createSelection([...userFieldsToExpose])
