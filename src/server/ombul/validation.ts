import { ValidationBase } from '@/server/Validation'
import { maxOmbulFileSize } from '@/server/ombul/ConfigVars'
import { imageFileSchema } from '@/server/images/schema'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseOmbulValidation = new ValidationBase({
    type: {
        ombulFile: z.instanceof(File),
        ombulCoverImage: imageFileSchema,
        year: z.string().optional(),
        issueNumber: z.string().optional(),
        name: z.string(),
        description: z.string(),
    }, 
    details: {
        ombulFile: z.instanceof(File).refine(file => file.size < maxOmbulFileSize, 'Fil må være mindre enn 10mb'),
        ombulCoverImage: imageFileSchema,
        year: z.number().refine(val => 
            (val === undefined) || (val >= 1919 && val <= (new Date()).getFullYear()), 
            'Må være mellom 1919 og nåværende år'
        ),
        issueNumber: z.number().optional().refine(val => 
            val === undefined || val <= 30, 'max 30'
        ),
        name: z.string().min(2, 'Minimum lengde er 2').max(25, 'Maximum lengde er 25').trim(),
        description: z.string().min(2, 'Minimum lengde er 2').max(100, 'Maximum lengde er 100').trim()
    }
})

const transformer = (data: {
    year?: string | undefined,
    issueNumber?: string | undefined,
}) => ({
    year: data.year ? parseInt(data.year) : new Date().getFullYear(),
    issueNumber: data.issueNumber ? parseInt(data.issueNumber) : undefined
})

export const createOmbulValidation = baseOmbulValidation.createValidation({
    keys: [
        'ombulFile',
        'ombulCoverImage',
        'year',
        'issueNumber',
        'name',
        'description'
    ],
    transformer: data => ({
        ...data, 
        ...transformer(data)
    }),
})
export type CreateOmbulTypes = ValidationTypes<typeof createOmbulValidation>

export const updateOmbulValidation = baseOmbulValidation.createValidation({
    keys: [
        'year',
        'issueNumber',
        'name',
        'description'
    ],
    transformer: (data) => ({
        ...data, 
        ...transformer(data)
    })
})
export type UpdateOmbulTypes = ValidationTypes<typeof updateOmbulValidation>

export const updateOmbulFileValidation = baseOmbulValidation.createValidation({
    keys: ['ombulFile'],
    transformer: data => data
})
export type UpdateOmbulFileTypes = ValidationTypes<typeof updateOmbulFileValidation>

