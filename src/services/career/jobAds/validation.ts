import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import type { ValidationTypes } from '@/services/Validation'

export const baseJobAdValidation = new ValidationBase({
    type: {
        company: z.string(),
        articleName: z.string(),
        description: z.string().or(z.literal('')),
    },
    details: {
        company: z.string().max(25, 'max lengde 25').min(2, 'min lengde 2'),
        articleName: z.string().max(50, 'max lengde 50').min(2, 'min lengde 2'),
        description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
    }
})

export const createJobAdValidation = baseJobAdValidation.createValidation({
    keys: [
        'company',
        'articleName',
        'description'
    ],
    transformer: data => data

})
export type CreateJobAdTypes = ValidationTypes<typeof createJobAdValidation>

export const updateJobAdValidation = baseJobAdValidation.createValidation({
    keys: [
        'company',
        'description'
    ],
    transformer: data => data
})
export type UpdateJobAdTypes = ValidationTypes<typeof updateJobAdValidation>


export const createJobAdSchema = zfd.formData({
    company: z.string().max(25, 'max lengde 25').min(2, 'min lengde 2'),
    articleName: z.string().max(50, 'max lengde 50').min(2, 'min lengde 2'),
    description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
})

export type JobAdSchemaType = z.infer<typeof createJobAdSchema>
