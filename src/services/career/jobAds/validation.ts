import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'
import { JobType } from '@prisma/client'

export const baseJobAdValidation = new ValidationBase({
    type: {
        companyId: z.coerce.number(),
        articleName: z.string(),
        description: z.string().or(z.literal('')),
        type: z.nativeEnum(JobType),
        applicationDeadline: z.date().or(z.literal('')).optional(),
        active: z.literal('on').optional(),
    },
    details: {
        companyId: z.number().int().positive().int(),
        articleName: z.string().max(50, 'max lengde 50').min(2, 'min lengde 2'),
        description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
        type: z.nativeEnum(JobType),
        applicationDeadline: z.date().optional(),
        active: z.boolean(),
    }
})

export const createJobAdValidation = baseJobAdValidation.createValidation({
    keys: [
        'companyId',
        'articleName',
        'description',
        'type',
        'applicationDeadline',
    ],
    transformer: data => ({
        ...data,
        applicationDeadline: data.applicationDeadline || undefined,
    })

})
export type CreateJobAdTypes = ValidationTypes<typeof createJobAdValidation>

export const updateJobAdValidation = baseJobAdValidation.createValidation({
    keys: [
        'companyId',
        'description',
        'type',
        'applicationDeadline',
        'active',
    ],
    transformer: data => ({
        ...data,
        applicationDeadline: data.applicationDeadline || undefined,
        active: data.active === 'on',
    })
})
export type UpdateJobAdTypes = ValidationTypes<typeof updateJobAdValidation>
