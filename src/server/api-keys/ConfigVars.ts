import { createSelection } from '@/server/createSelection'
import type { ApiKey } from '@prisma/client'

export const apiKeyFieldsToExpose = [
    'id',
    'active',
    'createdAt',
    'updatedAt',
    'name',
    'permissions'
] as const satisfies (keyof ApiKey)[]

export const apiKeyFilterSelection = createSelection([...apiKeyFieldsToExpose])
