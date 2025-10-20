import { ImageSize, SpecialCmsImage } from '@prisma/client'
import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().max(200, 'Maks lengde er 200 tegn.').optional(),
    special: z.nativeEnum(SpecialCmsImage).optional(),
    imageId: z.number().optional(),
    imageSize: z.nativeEnum(ImageSize).optional()
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
        imageSize: true
    }).partial()
}
