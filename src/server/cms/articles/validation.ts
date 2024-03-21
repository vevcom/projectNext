import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseArticleValidation = new ValidationBase({
    type: {
        name: z.string(),
    }, 
    details: {
        name: z.string().min(2, 'Minimum lengde er 2 tegn.').max(20, 'Maksimum lengde er 20 tegn.'),
    }
})

export const createArticleValidation = baseArticleValidation.createValidation({
    keys: ['name'],
    transformer: data => data
})
export type CreateArticleTypes = ValidationTypes<typeof createArticleValidation>

export const updateArticleValidation = baseArticleValidation.createValidationPartial({
    keys: ['name'],
    transformer: data => data
})
export type UpdateArticleTypes = ValidationTypes<typeof updateArticleValidation>
