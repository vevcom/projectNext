import { Validation } from '@/server/Validation'
import { z } from 'zod'
import type { ValidationType } from '@/server/Validation'

export const baseOmegaquotesValidation = new Validation({
    quote: z.string(),
    author: z.string(),
}, {
    quote: z.string().min(1, 'Sitatet kan ikke være tomt'),
    author: z.string().min(1, 'Noen må siteres'),
})

export const createOmegaquotesValidation = baseOmegaquotesValidation.pick([
    'quote',
    'author'
])
export type CreateOmegaguotesType = ValidationType<typeof createOmegaquotesValidation>
