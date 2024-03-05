import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const articleSchema = zfd.formData({
    name: z.string().min(2).max(20)
})

export type ArticleSchemaType = z.infer<typeof articleSchema>