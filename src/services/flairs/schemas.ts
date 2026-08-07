import { Zpn } from '@/lib/fields/zpn'
import { imageSchemas } from '@/services/images/subservice/schemas'
import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().min(2, 'min length is 2').max(50, 'max length is 50'),
    color: Zpn.colorInput(),
})

export const flairSchema = {
    create: baseSchema.pick({
        name: true,
        color: true,
    }).merge(imageSchemas.uploadImage),
    update: baseSchema.partial().pick({
        name: true,
        color: true,
    }),
    updateImage: imageSchemas.uploadImage,
} as const
