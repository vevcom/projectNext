import { allowedExtensions, maxImageCountInOneBatch, maxImageFileSize } from './constants'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

const maxFileSizeMb = Math.round(maxImageFileSize / 1024 / 1024)

export const imageFileSchema = z.instanceof(File).refine(
    file => file.size < maxImageFileSize, `File size must be less than ${maxFileSizeMb}mb`
).refine(
    file => allowedExtensions.includes(file.type.split('/')[1]),
    `File type must be one of ${allowedExtensions.join(', ')}`
)

const baseSchema = z.object({
    file: imageFileSchema,
    name: z.string().max(50, 'max length in 50').min(2, 'min length is 2').optional(),
    alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
    files: zfd.repeatable(z.array(z.instanceof(File)).refine(
        files => files.every(file => file.size < maxImageFileSize),
        `All file size must be less than ${maxFileSizeMb}mb`
    )).refine(
        files => files.every(file => allowedExtensions.includes(file.type.split('/')[1])),
        `File type must be one of ${allowedExtensions.join(', ')}`
    ).refine(
        files => files.length <= maxImageCountInOneBatch && files.length > 0,
        `Du kan bare laste opp mellom 1 og ${maxImageCountInOneBatch} bilder av gangen`
    ),
    licenseId: z.union([
        z.string().optional().nullable(),
        z.coerce.number().optional().or(z.literal('NULL')),
    ]).transform(
        value => {
            if (typeof value === 'string' && value === 'NULL') return null
            if (typeof value === 'string') return parseInt(value, 10)
            return value
        }
    ),
    credit: z.string().optional(),
})

export const imageSchemas = {
    create: baseSchema.pick({
        name: true,
        alt: true,
        file: true,
        licenseId: true,
        credit: true,
    }),

    createMany: baseSchema.pick({
        files: true,
        licenseId: true,
        credit: true,
    }),

    update: baseSchema.partial().pick({
        name: true,
        alt: true,
        credit: true,
        licenseId: true,
    }),
}
