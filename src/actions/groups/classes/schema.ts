import z from 'zod'
import zfd from 'zod-form-data'

export const createClassSchema = zfd.formData({
    name: z.string(),
    year: z.number(),
})

export type CreateClassSchemaType = z.infer<typeof createClassSchema>
