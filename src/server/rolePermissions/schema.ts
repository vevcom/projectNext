import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { Permission } from '@prisma/client'
import { Validation, ValidationType } from '../Validation'

export const baseRoleValidation = new Validation({
    id: z.coerce.number(),
    name: z.string(),
    permissions: zfd.repeatable(z.nativeEnum(Permission).array()),
}, {
    id: z.coerce.number(),
    name: z.string(),
    permissions: zfd.repeatable(z.nativeEnum(Permission).array()),
})

export const createRoleValidation = baseRoleValidation.pick([
    'name'
])
export type CreateRoleType = ValidationType<typeof createRoleValidation>

export const updateRoleValidation = baseRoleValidation.pick([
    'id',
    'name',
    'permissions'
])
export type UpdateRoleType = ValidationType<typeof updateRoleValidation>
