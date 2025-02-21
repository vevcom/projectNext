import { ImageConfig } from '@/services/images/config'
import { z } from 'zod'
import { zfd } from 'zod-form-data'

export namespace ImageSchemas {
    const maxFileSizeMb = Math.round(ImageConfig.maxFileSize / 1024 / 1024)
    export const fileSchema = z.instanceof(File).refine(
        file => file.size < ImageConfig.maxFileSize, `File size must be less than ${maxFileSizeMb}mb`
    ).refine(
        file => ImageConfig.allowedExtUpload.includes(file.type.split('/')[1]),
        `File type must be one of ${ImageConfig.allowedExtUpload.join(', ')}`
    )
    const imageSchemaFields = z.object({
        file: fileSchema,
        name: z.string().max(50, 'max length in 50').min(2, 'min length is 2').optional(),
        alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
        files: zfd.repeatable(z.array(z.instanceof(File)).refine(
            files => files.every(file => file.size < ImageConfig.maxFileSize),
            `All file size must be less than ${maxFileSizeMb}mb`
        )).refine(
            files => files.every(file => ImageConfig.allowedExtUpload.includes(file.type.split('/')[1])),
            `File type must be one of ${ImageConfig.allowedExtUpload.join(', ')}`
        ).refine(
            files => files.length <= ImageConfig.maxNumberInOneBatch && files.length > 0,
            `Du kan bare laste opp mellom 1 og ${ImageConfig.maxNumberInOneBatch} bilder av gangen`
        ),
        licenseId: z.string().optional().transform(
            value => (value === 'NULL' || value === undefined ? undefined : parseInt(value, 10))
        ),
        credit: z.string().optional(),
    })

    export const create = imageSchemaFields.pick({
        name: true,
        alt: true,
        file: true,
        licenseId: true,
        credit: true,
    })
    export const createMany = imageSchemaFields.pick({
        files: true,
        licenseId: true,
        credit: true,
    })
    export const update = imageSchemaFields.pick({
        name: true,
        alt: true,
        credit: true,
        licenseId: true,
    })
}
