import { ValidationBase } from '@/services/Validation'
import { SpecialCmsParagraph } from '@prisma/client'
import { z } from 'zod'
import type { ValidationTypes } from '@/services/Validation'

export const baseCmsParagraphValidation = new ValidationBase({
    type: {
        name: z.string(),
        special: z.nativeEnum(SpecialCmsParagraph).optional(),
    },
    details: {
        name: z.string(),
        special: z.nativeEnum(SpecialCmsParagraph).optional(),
    }
})

export const createCmsParagraphValidation = baseCmsParagraphValidation.createValidation({
    keys: ['name', 'special'],
    transformer: data => data
})

export type CreateCmsParagraphTypes = ValidationTypes<typeof createCmsParagraphValidation>

export const createCmsParagraphActionValidation = baseCmsParagraphValidation.createValidation({
    keys: ['name'],
    transformer: data => data
})

export type CreateCmsParagraphActionTypes = ValidationTypes<typeof createCmsParagraphActionValidation>
