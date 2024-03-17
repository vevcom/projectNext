import z from 'zod'

export const createCommitteeSchema = z.object({
    name: z.string().max(32, 'Maks 32 tegn.').min(1, 'Min 1 tegn.'),
    shortName: z.string().max(32, 'Maks 32 tegn.').min(1, 'Min 1 tegn.'),
    logoImageId: z.coerce.number().optional(),
})

export type CreateCommitteeSchemaType = z.infer<typeof createCommitteeSchema>

export const updateCommitteeSchema = createCommitteeSchema.partial()

export type UpdateCommitteeSchemaType = z.infer<typeof updateCommitteeSchema>
