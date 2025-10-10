import { zpn } from '@/lib/fields/zpn'
import { z } from 'zod'
import { Permission } from '@prisma/client'

const baseSchema = z.object({
    name: z.string().min(10, 'minimum lengde 10').max(100, 'maksimum lengde 100'),
    expiresAt: z.coerce.date().optional(),
    active: zpn.checkboxOrBoolean({ label: 'Aktiv' }),
    permissions: zpn.enumListCheckboxFriendly({ label: 'Tillatelser', enum: Permission })
})

export const apiKeySchemas = {
    create: baseSchema.pick({
        name: true,
    }),
    update: baseSchema.partial().pick({
        name: true,
        expiresAt: true,
        active: true,
        permissions: true
    }),
}
