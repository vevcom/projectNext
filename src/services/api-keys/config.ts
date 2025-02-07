import { createSelection } from '@/services/createSelection'
import type { ApiKey } from '@prisma/client'


const fieldsToExpose = [
    'id',
    'active',
    'createdAt',
    'updatedAt',
    'name',
    'permissions',
    'expiresAt'
] as const satisfies (keyof ApiKey)[]

export const filterSelection = createSelection([...fieldsToExpose])

export const apiKeysConfig = {
    fieldsToExpose,
    filterSelection,
    keyLength: 32,
}
