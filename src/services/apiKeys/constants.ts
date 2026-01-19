import { createSelection } from '@/services/createSelection'
import type { ApiKey } from '@/prisma-generated-pn-types'

export const apiKeyFieldsToExpose = [
    'id',
    'active',
    'createdAt',
    'updatedAt',
    'name',
    'permissions',
    'expiresAt'
] as const satisfies (keyof ApiKey)[]

export const apiFilterSelection = createSelection([...apiKeyFieldsToExpose])
export const apiKeyLength = 32 as const
