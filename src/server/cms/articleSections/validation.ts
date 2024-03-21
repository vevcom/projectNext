import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseArticleSectionSchema = new ValidationBase({
    type: {
        name: z.string(),
    }, 
    details: {
        name: z.string().max(20, 'Maks lengde er 20 tegn.'),
    }   
})

export const createArticleSectionSchema = baseArticleSectionSchema.createValidation({
    keys: ['name'],
    transformer: data => data,
})

export type CreateArticleSectionTypes = ValidationTypes<typeof createArticleSectionSchema>
