import { VisibilityRequirementGroupType } from '@prisma/client'
import { z } from 'zod'


const baseSchema = z.object({
    requirements: z.array(
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
})

export const visibilitySchemas = {
    update: baseSchema.pick({
        requirements: true
    }),
    params: z.object({
        visibilityId: z.number()
    })
} as const
