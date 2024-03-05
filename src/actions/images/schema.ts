import { maxFileSize } from './ConfigVars'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { File } from 'buffer'

export const createImageSchema = zfd.formData({
    file: z.instanceof(File).refine(file => file.size < maxFileSize, 'File size must be less than 10mb'),
    name: z.string().max(50, 'max length in 50').min(2, 'min length is 2'),
    alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
})

export type CreateImageSchemaType = z.infer<typeof createImageSchema>

export const createImagesSchema = zfd.formData({
    files: z.array(z.instanceof(File)).refine(
        files => files.every(file => file.size < maxFileSize),
        'File size must be less than 10mb'
    ),
}).refine(
    data => data.files.length < 100,
    'Max 100 files'
).refine(
    data => data.files.length > 0,
    'You must add a file!'
)

export type CreateImagesSchemaType = z.infer<typeof createImagesSchema>

export const updateImageSchema = zfd.formData({
    name: z.string().max(50, 'max length in 50').min(2, 'min length is 2').trim()
        .or(z.literal('')),
    alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2').trim()
        .or(z.literal('')),
}).transform(data => ({
    name: data.name || undefined,
    alt: data.alt || undefined,
}))

export type UpdateImageSchemaType = z.infer<typeof updateImageSchema>
