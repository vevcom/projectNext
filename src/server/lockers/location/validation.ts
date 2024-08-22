
import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'


export const baseLockerLocationValidation = new ValidationBase({
    type: {
        building: z.string(),
        floor: z.coerce.number(),
    },
    details: {
        building: z.string(),
        floor: z.coerce.number(),
    }
})


export const createLockerLocationValidation = baseLockerLocationValidation.createValidation({
    keys: [
        'building',
        'floor',
    ],
    transformer: data => data
})

export type CreateLockerLocationTypes = ValidationTypes<typeof createLockerLocationValidation>
