import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { Permission } from '@prisma/client'

const apiKeySchemaFields = z.object({
    name: z.string().min(10, 'minimum lengde 10').max(100, 'maksimum lengde 100'),
    expiresAt: z.coerce.date().optional(),
    active: z.literal('on').optional().transform(val => val === 'on'),
    permissions: zfd.repeatable(z.nativeEnum(Permission).array())
})

export const apiKeySchemas = {
    create: apiKeySchemaFields.pick({
        name: true,
    }),
    update: apiKeySchemaFields.partial().pick({
        name: true,
        expiresAt: true,
        active: true,
        permissions: true
    })
} as const
