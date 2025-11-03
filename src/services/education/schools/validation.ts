import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import { StandardSchool } from '@prisma/client'
import type { ValidationTypes } from '@/services/Validation'

const baseSchoolValidation = new ValidationBase({
    type: {
        name: z.string(),
        shortName: z.string(),
        standardSchool: z.nativeEnum(StandardSchool).optional(),
    },
    details: {
        name: z.string().max(50).min(1).trim(),
        shortName: z.string().max(20).min(1).trim(),
        standardSchool: z.nativeEnum(StandardSchool).optional(),
    }
})

export const createSchoolValidation = baseSchoolValidation.createValidation({
    keys: ['name', 'shortName', 'standardSchool'],
    transformer: data => data
})
export type CreateSchoolTypes = ValidationTypes<typeof createSchoolValidation>

export const updateSchoolValidation = baseSchoolValidation.createValidationPartial({
    keys: ['name', 'shortName'],
    transformer: data => data
})
export type UpdateSchoolTypes = ValidationTypes<typeof updateSchoolValidation>
