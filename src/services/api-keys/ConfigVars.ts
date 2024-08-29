import { createSelection } from '@/services/createSelection'
import type { ApiKey } from '@prisma/client'

export const apiKeyFieldsToExpose = [
    'id',
    'active',
    'createdAt',
    'updatedAt',
    'name',
    'permissions',
    'expiresAt'
] as const satisfies (keyof ApiKey)[]

export const KeyLength = 32

export const apiKeyFilterSelection = createSelection([...apiKeyFieldsToExpose])
