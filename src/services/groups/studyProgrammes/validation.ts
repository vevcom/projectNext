import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

const baseStudyProgrammeValidation = new ValidationBase({
    type: {
        id: z.number(),
        name: z.string(),
        code: z.string(),
        instituteCode: z.string().optional().nullable(),
        startYear: z.string().optional().nullable(),
        yearsLength: z.string().optional().nullable(),
    },
    details: {
        id: z.number(),
        name: z.string(),
        code: z.string(),
        instituteCode: z.string().optional().nullable(),
        startYear: z.number().optional().nullable(),
        yearsLength: z.number().optional().nullable(),
    }
})

export const createStudyProgrammeValidation = baseStudyProgrammeValidation.createValidation({
    keys: [
        'name',
        'code',
        'instituteCode',
        'startYear',
        'yearsLength',
    ],
    transformer: data => ({
        ...data,
        startYear: Number(data.startYear),
        yearsLength: Number(data.yearsLength),
    }),
})
export type CreateStudyProgrammeTypes = ValidationTypes<typeof createStudyProgrammeValidation>

export const updateStudyProgrammeValidation = baseStudyProgrammeValidation.createValidationPartial({
    keys: [
        'id',
        'name',
        'code',
        'instituteCode',
        'startYear',
        'yearsLength',
    ],
    transformer: data => ({
        ...data,
        startYear: Number(data.startYear),
        yearsLength: Number(data.yearsLength),
    }),
})

export type UpdateStudyProgrammeTypes = ValidationTypes<typeof updateStudyProgrammeValidation>

