import { SpecialCmsParagraph } from '@prisma/client'
import { z } from 'zod'


const baseSchema = z.object({
    name: z.string(),
    special: z.nativeEnum(SpecialCmsParagraph).optional(),
})

export const cmsParagraphSchemas = {
    create: baseSchema.pick({ name: true, special: true }),
    update: baseSchema.pick({ name: true, special: true }).partial(),
} as const
