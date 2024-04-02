import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const createJobAdSchema = zfd.formData({
    company: z.string().max(25, 'max lengde 25').min(2, 'min lengde 2'),
    articleName: z.string().max(50, 'max lengde 50').min(2, 'min lengde 2'),
    description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
})

export type JobAdSchemaType = z.infer<typeof createJobAdSchema>
