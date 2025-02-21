import { allowedExtImageUpload, maxFileSize, maxNumberOfImagesInOneBatch } from '@/services/images/ConfigVars'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const imageFileSchema = z.instanceof(File).refine(
    file => file.size < maxFileSize, 'File size must be less than 10mb'
).refine(
    file => allowedExtImageUpload.includes(file.type.split('/')[1]),
    `File type must be one of ${allowedExtImageUpload.join(', ')}`
)

const maxFileSizeMb = Math.round(maxFileSize / 1024 / 1024) 

const imageSchemaFields = z.object({
    file: imageFileSchema,
    name: z.string().max(50, 'max length in 50').min(2, 'min length is 2').optional(),
    alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
    files: zfd.repeatable(z.array(z.instanceof(File)).refine(
        files => files.every(file => file.size < maxFileSize),
        `File size must be less than ${maxFileSizeMb}mb`
    )).refine(
        files => files.every(file => allowedExtImageUpload.includes(file.type.split('/')[1])),
        `File type must be one of ${allowedExtImageUpload.join(', ')}`
    ).refine(
        files => files.length <= maxNumberOfImagesInOneBatch && files.length > 0,
        `Du kan bare laste opp mellom 1 og ${maxNumberOfImagesInOneBatch} bilder av gangen`
    ),
    licenseId: z.string().optional().transform(
        value => value === 'NULL' || value === undefined ? undefined : parseInt(value, 10)
    ),
    credit: z.string().optional(),
})

export const imageSchemas = {
    create: imageSchemaFields.pick({
        name: true,
        alt: true,
        file: true,
        licenseId: true,
        credit: true,
    }),
    createMany: imageSchemaFields.pick({
        files: true,
        licenseId: true,
        credit: true,
    }),
    update: imageSchemaFields.pick({
        name: true,
        alt: true,
        credit: true,
        licenseId: true,
    }),
} as const