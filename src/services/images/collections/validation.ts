import { ValidationBase } from '@/services/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

export const baseImageCollectionSchema = new ValidationBase({
    type: {
        name: z.string(),
        description: z.string(),
    },
    details: {
        name: z.string().max(40).min(2).trim(),
        description: z.string().max(500).min(2).trim(),
    }
})

export const createImageCollectionValidation = baseImageCollectionSchema.createValidation({
    keys: ['name', 'description'],
    transformer: data => data
})

export type CreateImageCollectionTypes = ValidationTypes<typeof createImageCollectionValidation>

export const updateImageCollectionValidation = baseImageCollectionSchema.createValidation({
    keys: ['name', 'description'],
    transformer: data => data
})
export type UpdateImageCollectionTypes = ValidationTypes<typeof updateImageCollectionValidation>
