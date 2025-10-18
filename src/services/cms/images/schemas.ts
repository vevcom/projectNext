import { SpecialCmsImage } from '@prisma/client'
import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().max(200, 'Maks lengde er 20 tegn.'),
    special: z.nativeEnum(SpecialCmsImage).optional(),
    imageId: z.number().optional()
})

export const cmsImageSchemas = {
    create: baseSchema.pick({
        name: true,
        special: true,
        imageId: true,
    }),
    update: baseSchema.pick({
        name: true,
        imageId: true,
    })
}
