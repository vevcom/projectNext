import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseNewsArticleValidation = new ValidationBase({
    type: {
        name: z.string(),
        description: z.string().or(z.literal('')),
        endDateTime: z.string().optional(),
    },
    details: {
        name: z.string().max(25, 'max lengde 25').min(2, 'min lengde 2'),
        description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
        endDateTime: z.date().optional()
    }
})
const dateTransformer = (data: string | undefined) => (data ? new Date(data) : undefined)

export const createNewsArticleValidation = baseNewsArticleValidation.createValidation({
    keys: [
        'name',
        'description',
        'endDateTime'
    ],
    transformer: data => ({
        ...data,
        endDateTime: dateTransformer(data.endDateTime)
    })
})
export type CreateNewsArticleTypes = ValidationTypes<typeof createNewsArticleValidation>

export const updateNewsArticleValidation = baseNewsArticleValidation.createValidation({
    keys: [
        'name',
        'description',
        'endDateTime'
    ],
    transformer: data => ({
        ...data,
        endDateTime: dateTransformer(data.endDateTime)
    })
})
export type UpdateNewsArticleTypes = ValidationTypes<typeof updateNewsArticleValidation>
