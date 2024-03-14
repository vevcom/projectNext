import { zfd } from 'zod-form-data'
import { z } from 'zod'

export const createCommitteeSchema = zfd.formData({
    name: z.string().max(30, 'Maks lengde er 30.').min(2, 'Minimum lende er 2.'),
})

export type CreateCommitteeSchemaType = z.infer<typeof createCommitteeSchema>
