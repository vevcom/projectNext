import { Validation } from '@/server/Validation'
import { SpecialCmsParagraph } from '@prisma/client'
import { z } from 'zod'
import type { ValidationType } from '@/server/Validation'

export const baseCmsParagraphSchema = new Validation({
    name: z.string(),
    special: z.nativeEnum(SpecialCmsParagraph).optional(),
}, {
    name: z.string(),
    special: z.nativeEnum(SpecialCmsParagraph).optional(),
})

export const createCmsParagraphSchema = baseCmsParagraphSchema

export type CreateCmsParagraphType = ValidationType<typeof createCmsParagraphSchema>
