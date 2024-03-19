import { Validation } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationType } from '@/server/Validation'

export const baseNewsArticleValidation = new Validation({
    name: z.string(),
    description: z.string().or(z.literal('')),
    endDateTime: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
}, {
    name: z.string().max(25, 'max lengde 25').min(2, 'min lengde 2'),
    description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
    endDateTime: z.string().optional().transform((val) => (val ? new Date(val) : undefined))
})
export const createNewsArticleValidation = baseNewsArticleValidation.pick([
    'name',
    'description',
    'endDateTime'
])
export type CreateNewsArticleType = ValidationType<typeof createNewsArticleValidation>

export const updateNewsArticleValidation = baseNewsArticleValidation.pick([
    'name',
    'description',
    'endDateTime'
])
export type UpdateNewsArticleType = ValidationType<typeof updateNewsArticleValidation>
