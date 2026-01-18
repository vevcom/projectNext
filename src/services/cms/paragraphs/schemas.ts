import { SpecialCmsParagraph } from '@/prisma-generated-pn-types'
import { z } from 'zod'


const baseSchema = z.object({
    name: z.string().optional(),
    special: z.nativeEnum(SpecialCmsParagraph).optional(),
    markdown: z.string()
})

export const cmsParagraphSchemas = {
    create: baseSchema.pick({ name: true, special: true }),
    update: baseSchema.pick({ name: true }).partial(),
    updateContent: baseSchema.pick({ markdown: true })
} as const
