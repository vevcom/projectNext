import z from 'zod'
import zfd from 'zod-form-data'

export const createCommitteeSchema = zfd.formData({
    name: z.string()
})

export type CreateCommitteeSchemaType = z.infer<typeof createCommitteeSchema>
