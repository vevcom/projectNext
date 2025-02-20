import { z } from 'zod'
import { JobType } from '@prisma/client'

const jobAdSchemaFields = z.object({
    companyId: z.number().int().positive().int(),
    articleName: z.string().max(50, 'max lengde 50').min(2, 'min lengde 2'),
    description: z.string().max(200, 'max lengde 200').min(2, 'min lengde 2').or(z.literal('')),
    type: z.nativeEnum(JobType),
    applicationDeadline: z.coerce.date().optional(),
    active: z.boolean(),
    location: z.string().optional(),
})

export const jobAdSchemas = {
    create: jobAdSchemaFields.pick({
        companyId: true,
        articleName: true,
        description: true,
        type: true,
        applicationDeadline: true,
        location: true,
    }),
    update: jobAdSchemaFields.partial().pick({
        companyId: true,
        description: true,
        type: true,
        applicationDeadline: true,
        active: true,
        location: true,
    })
} as const
