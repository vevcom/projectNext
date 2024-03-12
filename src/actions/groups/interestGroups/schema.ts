import z from 'zod'
import zfd from 'zod-form-data'

export const createInterestGroupSchema = zfd.formData({
    name: z.string()
})

export type CreateInterestGroupSchemaType = z.infer<typeof createInterestGroupSchema>