import {
    allowedExtensions,
    maxImageCountInOneBatch,
    maxImageFileSizeBytes,
    maxImageFileSizeMb
} from './constants'
import { readPageInputSchema } from '@/lib/paging/schema'
import { zfd } from 'zod-form-data'
import { z } from 'zod'
import { File } from 'node:buffer'

// ts does not like doing .includes(x) if x does not neccessarily have the same type as the
// array elements, so we need to make sure that the array is of type readonly string[] instead
// the narrower union type array.
const extentionsAsStringArray: readonly string[] = allowedExtensions

export const imageFileSchema = z.instanceof(File).refine(
    file => file.size < maxImageFileSizeBytes, `File size must be less than ${maxImageFileSizeMb}mb`
).refine(
    file => extentionsAsStringArray.includes(file.type.split('/')[1]),
    `File type must be one of ${allowedExtensions.join(', ')}`
)

export const baseSchema = z.object({
    collectionName: z.string().max(40).min(2).trim(),
    collectionDescription: z.string().max(500).min(2).trim(),
    coverImageId: z.number().optional(),

    imageFile: imageFileSchema,
    imageName: z.string().max(50, 'max length in 50').min(2, 'min length is 2').optional(),
    imageAlt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
    imageFiles: zfd.repeatable(z.array(z.instanceof(File)).refine(
        files => files.every(file => file.size < maxImageFileSizeBytes),
        `Alle filer må være mindre enn ${maxImageFileSizeMb}mb`
    )).refine(
        files => files.every(file => (allowedExtensions as readonly string[]).includes(file.type.split('/')[1])),
        `Filtypen må være en av ${allowedExtensions.join(', ')}`
    ).refine(
        files => files.length <= maxImageCountInOneBatch && files.length > 0,
        `Du kan bare laste opp mellom 1 og ${maxImageCountInOneBatch} bilder av gangen`
    ),
    imageLicenseId: z.union([
        z.string().optional().nullable(),
        z.coerce.number().optional().or(z.literal('NULL')),
    ]).transform(
        value => {
            if (typeof value === 'string' && value === 'NULL') return null
            if (typeof value === 'string') return parseInt(value, 10)
            return value
        }
    ),
    imageCredit: z.string().optional(),
})

const pageSchema = readPageInputSchema(
    z.number(),
    z.object({
        imageId: z.number(),
    }),
    z.undefined(),
)

export const imageSchemas = {
    paramsSchemaCollection: z.union([
        z.object({ collectionId: z.number() }),
        z.object({ collectionName: z.string() })
    ]),
    paramsSchemaImage: z.object({
        imageId: z.number(),
    }),
    paramsSchemaUploadManyImages: z.object({
        collectionId: z.number(),
        useFileName: z.boolean(),
    }),
    paramsSchemaReadPageOfImagesInCollection: z.object({
        paging: pageSchema,
        collectionId: z.number(),
    }),
    paramsSchemaReadPageOfImagesInSpecialCollection: z.object({
        paging: pageSchema,
    }),
    updateCollection: baseSchema.partial().pick({
        collectionName: true,
        collectionDescription: true,
        coverImageId: true,
    }),
    uploadImage: baseSchema.pick({
        imageName: true,
        imageAlt: true,
        imageFile: true,
        imageLicenseId: true,
        imageCredit: true,
    }),
    uploadManyImages: baseSchema.pick({
        imageFiles: true,
        imageLicenseId: true,
        imageCredit: true,
    }),
    updateImageMeta: baseSchema.partial().pick({
        imageName: true,
        imageAlt: true,
        imageLicenseId: true,
        imageCredit: true,
    }),
} as const
