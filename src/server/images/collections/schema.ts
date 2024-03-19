import { Validation } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationType } from '@/server/Validation'

export const baseImageCollectionSchema = new Validation({
    name: z.string(),
    description: z.string(),
}, {
    name: z.string().max(40).min(2).trim(),
    description: z.string().max(500).min(2).trim(),
})

export const createImageCollectionValidation = baseImageCollectionSchema.pick([
    'name',
    'description',
])

export type CreateImageCollectionType = ValidationType<typeof createImageCollectionValidation>

export const updateImageCollectionValidation = baseImageCollectionSchema.pick([
    'name',
    'description',
])

export type UpdateImageCollectionType = ValidationType<typeof updateImageCollectionValidation>
