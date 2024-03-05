import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const createImageCollectionSchema = zfd.formData({
    name: z.string().max(40).min(2).trim(),
    description: z.string().max(500).min(2).trim(),
})

export type CreateImageCollectionSchemaType = z.infer<typeof createImageCollectionSchema>

export const updateImageCollectionSchema = zfd.formData({
    name: z.string().max(40).min(2).trim()
        .or(z.literal('')),
    description: z.string().max(500).min(2).trim()
        .or(z.literal('')),
}).transform(data => ({
    name: data.name || undefined,
    description: data.description || undefined,
}))

export type UpdateImageCollectionSchemaType = z.infer<typeof updateImageCollectionSchema>
