import { Validation } from '@/server/Validation'
import { SpecialCmsImage } from '@prisma/client'
import { z } from 'zod'
import type { ValidationType } from '@/server/Validation'

export const baseCmsImageSchema = new Validation({
    name: z.string(),
    special: z.nativeEnum(SpecialCmsImage).optional(),
}, {
    name: z.string().max(200, 'Maks lengde er 20 tegn.'),
    special: z.nativeEnum(SpecialCmsImage).optional(),
})

export const createCmsImageSchema = baseCmsImageSchema

export type CreateCmsImageType = ValidationType<typeof createCmsImageSchema>
