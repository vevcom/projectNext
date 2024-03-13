import z from 'zod'
import zfd from 'zod-form-data'

export const createstudyProgrammeSchema = zfd.formData({
    name: z.string()
})

export type CreatestudyProgrammeSchemaType = z.infer<typeof createstudyProgrammeSchema>
