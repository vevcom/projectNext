import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

const baseStudyProgramValidation = new ValidationBase({
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

export const createStudyProgramValidation = baseStudyProgramValidation.createValidation({
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
export type CreateStudyProgramTypes = ValidationTypes<typeof createStudyProgramValidation>

export const updateStudyProgramValidation = baseStudyProgramValidation.createValidationPartial({
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

export type UpdateStudyProgramTypes = ValidationTypes<typeof updateStudyProgramValidation>

