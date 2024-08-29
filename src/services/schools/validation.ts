import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'
import { StandardSchool } from '@prisma/client'

const baseSchoolValidation = new ValidationBase({
    type: {
        name: z.string(),
        shortname: z.string(),
        standardSchool: z.nativeEnum(StandardSchool).optional(),
    },
    details: {
        name: z.string().max(50).min(1).trim(),
        shortname: z.string().max(32).min(1).trim(),
        standardSchool: z.nativeEnum(StandardSchool).optional(),
    }
})

export const createSchoolValidation = baseSchoolValidation.createValidation({
    keys: ['name', 'shortname', 'standardSchool'],
    transformer: data => data
})
export type CreateSchoolTypes = ValidationTypes<typeof createSchoolValidation>

export const updateSchoolValidation = baseSchoolValidation.createValidationPartial({
    keys: ['name', 'shortname'],
    transformer: data => data
})
export type UpdateSchoolTypes = ValidationTypes<typeof updateSchoolValidation>
