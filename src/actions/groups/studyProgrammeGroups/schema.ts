import z from 'zod'
import zfd from 'zod-form-data'

export const createStudyProgrammeGroupSchema = zfd.formData({
    name: z.string()
})

export type CreateStudyProgrammeGroupSchemaType = z.infer<typeof createStudyProgrammeGroupSchema>
