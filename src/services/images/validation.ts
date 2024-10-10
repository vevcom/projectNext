import { ValidationBase } from '@/services/Validation'
import { maxFileSize, maxNumberOfImagesInOneBatch } from '@/services/images/ConfigVars'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import type { ValidationTypes } from '@/services/Validation'

export const imageFileSchema = z.instanceof(File).refine(file => file.size < maxFileSize, 'File size must be less than 10mb')

const maxFileSizeMb = Math.round(maxFileSize / 1024 / 1024)

export const baseImageValidation = new ValidationBase({
    type: {
        file: z.instanceof(File),
        name: z.string().optional(),
        alt: z.string(),
        files: zfd.repeatable(z.array(z.instanceof(File))),
    },
    details: {
        file: imageFileSchema,
        name: z.string().max(50, 'max length in 50').min(2, 'min length is 2').optional(),
        alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
        files: zfd.repeatable(z.array(z.instanceof(File)).refine(
            files => files.every(file => file.size < maxFileSize),
            `File size must be less than ${maxFileSizeMb}mb`
        ))
    }
})

export const createImageValidation = baseImageValidation.createValidation({
    keys: ['name', 'alt', 'file'],
    transformer: data => data
})
export type CreateImageTypes = ValidationTypes<typeof createImageValidation>

export const createImagesValidation = baseImageValidation.createValidation({
    keys: ['files'],
    transformer: data => data,
    refiner: {
        fcn: data => data.files.length < maxNumberOfImagesInOneBatch && data.files.length > 0,
        message: `Du kan bare laste opp mellom 1 og ${maxNumberOfImagesInOneBatch} bilder av gangen`
    }
})
export type CreateImagesTypes = ValidationTypes<typeof createImagesValidation>

export const updateImageValidation = baseImageValidation.createValidation({
    keys: ['name', 'alt'],
    transformer: data => data
})
export type UpdateImageTypes = ValidationTypes<typeof updateImageValidation>
