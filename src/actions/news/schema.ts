import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const newsArticleSchema = zfd.formData({
    name: z.string().max(25, 'max lengde 25').min(2, 'min lengde 2'),
    description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
    endDateTime: z.string().optional().transform((val) => (val ? new Date(val) : undefined)),
})

export type NewsArticleSchemaType = z.infer<typeof newsArticleSchema>
