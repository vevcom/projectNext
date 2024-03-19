import { Validation } from '@/server/Validation'
import { maxFileSize } from '@/server/images/ConfigVars'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import type { ValidationType } from '@/server/Validation'

export const imageFileSchema = z.instanceof(File).refine(file => file.size < maxFileSize, 'File size must be less than 10mb')

export const baseImageValidation = new Validation({
    file: z.instanceof(File),
    name: z.string(),
    alt: z.string(),
    files: zfd.repeatable(z.array(z.instanceof(File)).refine(
        files => files.every(file => file.size < maxFileSize),
        'File size must be less than 10mb'
    )),
}, {
    file: imageFileSchema,
    name: z.string().max(50, 'max length in 50').min(2, 'min length is 2'),
    alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
    files: zfd.repeatable(z.array(z.instanceof(File)).refine(
        files => files.every(file => file.size < maxFileSize),
        'File size must be less than 10mb'
    ))
})

export const createImageValidation = baseImageValidation.pick([
    'name',
    'alt',
    'file'
])
export type CreateImageType = ValidationType<typeof createImageValidation>

export const createImagesValidation = baseImageValidation.pick([
    'files'
]).setRefiner(
    data => data.files.length < 100 && data.files.length > 0,
    'Max 100 files og mist 1'
)
export type CreateImagesType = ValidationType<typeof createImagesValidation>

export const updateImageValidation = baseImageValidation.pick([
    'name',
    'alt',
])
export type UpdateImageType = ValidationType<typeof updateImageValidation>
