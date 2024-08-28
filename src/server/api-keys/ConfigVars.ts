import { createSelection } from '@/server/createSelection'
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

export const KeyAllowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
export const KeyLength = 32;

export const apiKeyFilterSelection = createSelection([...apiKeyFieldsToExpose])
