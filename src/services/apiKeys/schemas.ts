import { Zpn } from '@/lib/fields/zpn'
import { Permission } from '@/prisma-generated-pn-types'
import { z } from 'zod'

const baseSchema = z.object({
    name: z.string().min(10, 'minimum lengde 10').max(100, 'maksimum lengde 100'),
    expiresAt: z.coerce.date().optional(),
    active: Zpn.checkboxOrBoolean({ label: 'Aktiv' }),
    permissions: Zpn.enumListCheckboxFriendly({ label: 'Tillatelser', enum: Permission })
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
