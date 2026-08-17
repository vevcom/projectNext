import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().max(200, 'Maks lengde er 200 tegn.').optional(),
    imageId: z.number().optional(),
})

export const cmsImageSchemas = {
    create: baseSchema.pick({
        name: true,
        imageId: true,
    }),
    update: baseSchema.pick({
        name: true,
        imageId: true,
    }).partial()
}
