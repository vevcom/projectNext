import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

const baseSchoolValidation = new ValidationBase({
    type: {
        name: z.string(),
        shortname: z.string(),
    },
    details: {
        name: z.string().max(32).min(1).trim(),
        shortname: z.string().max(32).min(1).trim(),
    }
})

export const createSchoolValidation = baseSchoolValidation.createValidation({
    keys: ['name', 'shortname'],
    transformer: data => data
})
export type CreateSchoolTypes = ValidationTypes<typeof createSchoolValidation>

export const updateSchoolValidation = baseSchoolValidation.createValidationPartial({
    keys: ['name', 'shortname'],
    transformer: data => data
})
export type UpdateSchoolTypes = ValidationTypes<typeof updateSchoolValidation>
