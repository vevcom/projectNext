import { maxOmbulFileSize } from '@/server/ombul/ConfigVars'
import { imageFileSchema } from '@/actions/images/schema'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const ombulSchema = z.object({
    ombulFile: z.instanceof(File).refine(file => file.size < maxOmbulFileSize, 'Fil må være mindre enn 10mb'),
    ombulCoverImage: imageFileSchema,
    year: z.string().transform(val => parseInt(val, 10))
        .refine(val => val >= 1900 && val <= new Date().getFullYear(), 'År må være mellom 1900 og nå').optional(),
    issueNumber: z.string().transform(val => parseInt(val, 10))
        .refine(val => val <= 30, 'max 30').optional(),
    name: z.string().min(2, 'Minimum lengde er 2').max(25, 'Maximum lengde er 25').trim(),
    description: z.string().min(2, 'Minimum lengde er 2').max(100, 'Maximum lengde er 100').trim()
})

export const createOmbulSchema = zfd.formData(ombulSchema)
export type CreateOmbulSchemaType = z.infer<typeof createOmbulSchema>

export const updateOmbulSchema = zfd.formData(
    ombulSchema.partial().omit({
        ombulFile: true,
        ombulCoverImage: true
    })
)
export type UpdateOmbulSchemaType = z.infer<typeof updateOmbulSchema>

export const updateObuleFileSchema = zfd.formData(
    ombulSchema.pick({
        ombulFile: true
    })
)
export type UpdateOmbulFileSchemaType = z.infer<typeof updateObuleFileSchema>

