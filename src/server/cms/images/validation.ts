import { ValidationBase } from '@/server/Validation'
import { SpecialCmsImage } from '@prisma/client'
import { z } from 'zod'
import type { ValidationTypes } from '@/server/Validation'

export const baseCmsImageValidation = new ValidationBase({
    type: {
        name: z.string(),
        special: z.nativeEnum(SpecialCmsImage).optional(),
    }, 
    details: {
        name: z.string().max(200, 'Maks lengde er 20 tegn.'),
        special: z.nativeEnum(SpecialCmsImage).optional(),
    }
})

export const createCmsImageValidation = baseCmsImageValidation.createValidation({
    keys: ['name', 'special'],
    transformer: data => data,
})

export type CreateCmsImageTypes = ValidationTypes<typeof createCmsImageValidation>
