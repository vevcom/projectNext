import { imageSchemas } from '@/services/images/subservice/schemas'
import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().max(32).min(1).trim(),
    shortName: z.string().max(32).min(1).trim(),
})

export const committeeSchemas = {
    // The logo is optional on create - committeeOperations.create falls back to the
    // DEFAULT_COMMITTEE_LOGO standard image when it's omitted.
    create: baseSchema.pick({
        name: true,
        shortName: true,
    }).merge(imageSchemas.uploadImage.partial()),
    update: baseSchema.pick({
        name: true,
        shortName: true,
    }).partial(),
    updateLogo: imageSchemas.uploadImage,
} as const
