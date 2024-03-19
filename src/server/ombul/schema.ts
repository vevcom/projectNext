import { maxOmbulFileSize } from '@/server/ombul/ConfigVars'
import { imageFileSchema } from '@/server/images/schema'
import { z } from 'zod'
import { Validation, ValidationType } from '../Validation'

export const baseOmbulValidation = new Validation({
    ombulFile: z.instanceof(File),
    ombulCoverImage: imageFileSchema,
    year: z.string().transform(val => parseInt(val, 10))
        .refine(val => val >= 1900 && val <= new Date().getFullYear(), 'År må være mellom 1900 og nå').optional(),
    issueNumber: z.string().transform(val => parseInt(val, 10))
        .refine(val => val <= 30, 'max 30').optional(),
    name: z.string(),
    description: z.string(),
}, {
    ombulFile: z.instanceof(File).refine(file => file.size < maxOmbulFileSize, 'Fil må være mindre enn 10mb'),
    ombulCoverImage: imageFileSchema,
    year: z.string().transform(val => parseInt(val, 10))
        .refine(val => val >= 1900 && val <= new Date().getFullYear(), 'År må være mellom 1900 og nå').optional(),
    issueNumber: z.string().transform(val => parseInt(val, 10))
        .refine(val => val <= 30, 'max 30').optional(),
    name: z.string().min(2, 'Minimum lengde er 2').max(25, 'Maximum lengde er 25').trim(),
    description: z.string().min(2, 'Minimum lengde er 2').max(100, 'Maximum lengde er 100').trim()
})

export const createOmbulValidation = baseOmbulValidation
export type CreateOmbulType = ValidationType<typeof createOmbulValidation>

export const updateOmbulValidation = baseOmbulValidation.pick([
    'year',
    'issueNumber',
    'name',
    'description'
])
export type UpdateOmbulType = ValidationType<typeof updateOmbulValidation>

export const updateOmbulFileValidation = baseOmbulValidation.pick([
    'ombulFile'
])
export type UpdateOmbulFileType = ValidationType<typeof updateOmbulFileValidation>

