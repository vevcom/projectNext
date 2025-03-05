import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { Permission } from '@prisma/client'

export namespace ApiKeySchemas {
    const fields = z.object({
        name: z.string().min(10, 'minimum lengde 10').max(100, 'maksimum lengde 100'),
        expiresAt: z.coerce.date().optional(),
        active: z.literal('on').optional().transform(val => val === 'on'),
        permissions: zfd.repeatable(z.nativeEnum(Permission).array())
    })
    export const create = fields.pick({
        name: true,
    })
    export const update = fields.partial().pick({
        name: true,
        expiresAt: true,
        active: true,
        permissions: true
    })
}
