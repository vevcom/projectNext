import { z } from 'zod'
import { zfd } from 'zod-form-data'

export const omegaquotesSchema = zfd.formData({
    quote: z.string().min(1, 'Sitatet kan ikke være tomt'),
    author: z.string().min(1, 'Noen må siteres'),
})

export type OmegaquotesSchemaType = z.infer<typeof omegaquotesSchema>
