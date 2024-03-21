import { ValidationBase } from '@/server/Validation'
import { ValidationTypes } from '@/server/Validation'
import { maxFileSize } from '@/server/images/ConfigVars'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const imageFileSchema = z.instanceof(File).refine(file => file.size < maxFileSize, 'File size must be less than 10mb')

export const baseImageValidation = new ValidationBase({
    type: {
        file: z.instanceof(File),
        name: z.string(),
        alt: z.string(),
        files: zfd.repeatable(z.array(z.instanceof(File))),
    }, 
    details: {
        file: imageFileSchema,
        name: z.string().max(50, 'max length in 50').min(2, 'min length is 2'),
        alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
        files: zfd.repeatable(z.array(z.instanceof(File)).refine(
            files => files.every(file => file.size < maxFileSize),
            'File size must be less than 10mb'
        ))
    }
})

export const createImageValidation = baseImageValidation.createValidation({
    keys: ['name', 'alt' ,'file'],
    transformer: data => data
})
export type CreateImageTypes = ValidationTypes<typeof createImageValidation>

export const createImagesValidation = baseImageValidation.createValidation({
    keys: ['files'],
    transformer: data => data,
    refiner: {
        fcn: data => data.files.length < 100 && data.files.length > 0,
        message: 'Du kan bare laste opp mellom 1 og 100 bilder'
    }
})
export type CreateImagesTypes = ValidationTypes<typeof createImagesValidation>

export const updateImageValidation = baseImageValidation.createValidation({
    keys: ['name', 'alt'],
    transformer: data => data
})
export type UpdateImageTypes = ValidationTypes<typeof updateImageValidation>
