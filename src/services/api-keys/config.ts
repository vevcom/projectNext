import { createSelection } from '@/services/createSelection'
import type { ApiKey } from '@prisma/client'



export namespace ApiKeysConfig {
    export const fieldsToExpose = [
        'id',
        'active',
        'createdAt',
        'updatedAt',
        'name',
        'permissions',
        'expiresAt'
    ] as const satisfies (keyof ApiKey)[]
    
    export const filterSelection = createSelection([...fieldsToExpose])
    export const keyLength = 32 as const
}
