import { z } from 'zod'
import { maxFileSize } from './ConfigVars'

export const imageSchema = z.object({
    file: z.instanceof(File).refine(file => file.size < maxFileSize, 'File size must be less than 10mb'),
    name: z.string().max(50, 'max length in 50').min(2, 'min length is 2'),
    alt: z.string().max(100, 'max length in 50').min(2, 'min length is 2'),
})

export const imageSchemaMany = z.object({
    files: z.array(z.instanceof(File)).refine(
        files => files.every(file => file.size < maxFileSize),
        'File size must be less than 10mb'
    ),
})
.refine(
    data => data.files.length < 100, 'Max 100 files')
.refine(
    data => data.files.length > 0, 'You must add a file!'
)