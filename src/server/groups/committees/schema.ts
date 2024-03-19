import { Validation, ValidationType } from '@/server/Validation'
import { z } from 'zod'

const baseCommitteeValidation = new Validation({
    name: z.string(),
    shortName: z.string(),
    logoImageId: z.number().optional(),
}, {
    name: z.string().max(32).min(1).trim(),
    shortName: z.string().max(32).min(1).trim(),
    logoImageId: z.number().optional(),
})

export const createCommitteeValidation = baseCommitteeValidation
export type CreateCommitteeType = ValidationType<typeof baseCommitteeValidation>

export const updateCommitteeValidation = createCommitteeValidation.partialize()
export type UpdateCommitteeType = ValidationType<typeof updateCommitteeValidation>
