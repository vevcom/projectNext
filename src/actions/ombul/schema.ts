import { maxOmbulFileSize } from './ConfigVars'
import { imageSchema } from '@/actions/images/schema'
import { z } from 'zod'

const ombulSchema = z.object({
    ombulFile: z.instanceof(File).refine(file => file.size < maxOmbulFileSize, 'Fil må være mindre enn 10mb'),
    ombulCoverImage: imageSchema.shape.file,
    year: z.string().transform(val => parseInt(val))
        .refine(val => val >= 1900 && val <= new Date().getFullYear(), 'År må være mellom 1900 og nå').optional(),
    issueNumber: z.string().transform(val => parseInt(val))
        .refine(val => val <= 30, 'max 30').optional(),
    name: z.string().min(2, 'Minimum lengde er 2').max(25, 'Maximum lengde er 25').trim(),
    description: z.string().min(2, 'Minimum lengde er 2').max(100, 'Maximum lengde er 100').trim()
})

const ombulUpdateSchema = ombulSchema.partial().omit({
    ombulFile: true,
    ombulCoverImage: true
})

const ombulUpdateFileSchema = ombulSchema.pick({
    ombulFile: true
})

export default ombulSchema
export { ombulUpdateSchema, ombulUpdateFileSchema }
