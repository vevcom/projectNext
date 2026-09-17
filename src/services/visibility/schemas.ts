import { VisibilityRequirementGroupType } from '@/prisma-generated-pn-types'
import { z } from 'zod'

/**
 * Exported so services that take a visibility as part of their own input - rather than through
 * visibilityOperations.update - can compose it into their schemas.
 */
export const visibilityRequirementsSchema = z.array(
    z.object({
        conditions: z.array(
            z.union([
                z.object({
                    type: z.literal(VisibilityRequirementGroupType.ORDER),
                    order: z.number().min(0),
                    groupId: z.number()
                }),
                z.object({
                    type: z.literal(VisibilityRequirementGroupType.ACTIVE),
                    groupId: z.number()
                })
            ])
        )
    })
)

const baseSchema = z.object({
    requirements: visibilityRequirementsSchema
})

export const visibilitySchemas = {
    update: baseSchema.pick({
        requirements: true
    }),
    createWithRequirements: baseSchema.pick({
        requirements: true
    }),
    params: z.object({
        visibilityId: z.number()
    })
} as const
