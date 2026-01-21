import { imageFileSchema } from '@/services/images/schemas'
import { maxOmbulFileSize } from '@/services/ombul/ConfigVars'
import { z } from 'zod'
import { File } from 'node:buffer'

export const baseSchema = z.object({
    ombulFile: z.instanceof(File).refine(file => file.size < maxOmbulFileSize, 'Fil må være mindre enn 10mb'),
    ombulCoverImage: imageFileSchema, //TODO: Let image subservice handle this.
    year: z.coerce.number().int().refine(val =>
        (val === undefined) || (val >= 1919 && val <= (new Date()).getFullYear()),
    'Må være mellom 1919 og nåværende år'
    ),
    issueNumber: z.coerce.number().optional().refine(val =>
        val === undefined || val <= 30, 'max 30'
    ),
    name: z.string().min(2, 'Minimum lengde er 2').max(25, 'Maximum lengde er 25').trim(),
    description: z.string().min(2, 'Minimum lengde er 2').max(100, 'Maximum lengde er 100').trim()
})

export const ombulSchemas = {
    create: baseSchema.pick({
        ombulFile: true,
        ombulCoverImage: true,
        year: true,
        issueNumber: true,
        name: true,
        description: true
    }),
    update: baseSchema.pick({
        year: true,
        issueNumber: true,
        name: true,
        description: true
    }),
    updateFile: baseSchema.pick({
        ombulFile: true
    })
}
