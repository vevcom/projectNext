import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

const baseSchoolValidation = new ValidationBase({
    type: {
        name: z.string(),
        shortName: z.string(),
    },
    details: {
        name: z.string().max(32).min(1).trim(),
        shortName: z.string().max(32).min(1).trim(),
    }
})

export const createSchoolValidation = baseSchoolValidation.createValidation({
    keys: ['name', 'shortName'],
    transformer: data => data
})
export type CreateSchoolTypes = ValidationTypes<typeof createSchoolValidation>

export const updateSchoolValidation = baseSchoolValidation.createValidationPartial({
    keys: ['name', 'shortName'],
    transformer: data => data
})
export type UpdateSchoolTypes = ValidationTypes<typeof updateSchoolValidation>
