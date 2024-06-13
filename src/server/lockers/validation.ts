import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'


export const baseLockerValidation = new ValidationBase({
    type: {
        building: z.string(),
        floor: z.coerce.number(),
        id: z.coerce.number()
    },
    details: {
        building: z.string(),
        floor: z.coerce.number(),
        id: z.coerce.number()
    }
})


export const createLockerValidation = baseLockerValidation.createValidation({
    keys: [
        'building',
        'floor',
        'id'
        ],
    transformer: data => data
})

export type CreateLockerTypes = ValidationTypes<typeof createLockerValidation>
