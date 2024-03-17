import { createCommitteeSchema } from '@/server/groups/committees/schema'
import { zfd } from 'zod-form-data'
import { z } from 'zod'

export const createCommitteeActionSchema = zfd.formData(createCommitteeSchema)

export type CreateCommitteeActionSchemaType = z.infer<typeof createCommitteeSchema>

export const readCommitteeActionSchema = zfd.formData({
    id: z.coerce.number().optional(),
    shortName: z.string().optional(),
})

export type ReadCommitteeActionSchemaType = z.infer<typeof readCommitteeActionSchema>
