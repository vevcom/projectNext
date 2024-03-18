import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { Permission } from '@prisma/client'

export const createRoleSchema = zfd.formData({ name: z.string() })

export type CreateRoleSchemaType = z.infer<typeof createRoleSchema>

export const updateRoleSchema = zfd.formData({
    id: z.coerce.number(),
    name: z.string(),
    permissions: zfd.repeatable(z.nativeEnum(Permission).array()),
})

export type UpdateRoleSchemaType = z.infer<typeof updateRoleSchema>
