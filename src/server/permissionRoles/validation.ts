import { ValidationBase } from '@/server/Validation'
import { z } from 'zod'
import { zfd } from 'zod-form-data'
import { Permission } from '@prisma/client'
import type { ValidationTypes } from '@/server/Validation'

export const baseRoleValidation = new ValidationBase({
    type: {
        id: z.coerce.number(),
        name: z.string(),
        permissions: zfd.repeatable(z.nativeEnum(Permission).array()),
    }, 
    details: {
        id: z.coerce.number(),
        name: z.string(),
        permissions: zfd.repeatable(z.nativeEnum(Permission).array()),
    }
})

export const createRoleValidation = baseRoleValidation.createValidation({
    keys: ['name'],
    transformer: data => data
})
export type CreateRoleTypes = ValidationTypes<typeof createRoleValidation>

export const updateRoleValidation = baseRoleValidation.createValidation({
    keys: ['id','name','permissions'],
    transformer: data => data
})
export type UpdateRoleTypes = ValidationTypes<typeof updateRoleValidation>

export const updateDefaultPermissionsValidation = baseRoleValidation.createValidation({
    keys: ['permissions'],
    transformer: data => data
})
export type UpdateDefaultPermissionsTypes = ValidationTypes<typeof updateDefaultPermissionsValidation>

export const baseGroupRoleActionValidation = new ValidationBase({
    type: {
        groupId: z.coerce.number(),
        roleId: z.coerce.number(),
        forAdminsOnly: z.coerce.boolean().optional(),
    }, 
    details: {
        groupId: z.coerce.number(),
        roleId: z.coerce.number(),
        forAdminsOnly: z.coerce.boolean().optional(),
    }
})

export const addGroupToRoleActionValidation = baseGroupRoleActionValidation.createValidation({
    keys: ['groupId','roleId','forAdminsOnly'],
    transformer: data => data
})
export type AddGroupToRoleActionTypes = ValidationTypes<typeof addGroupToRoleActionValidation>

export const updateGroupRoleRelationActionValidation = baseGroupRoleActionValidation.createValidation({
    keys: ['groupId','roleId','forAdminsOnly'],
    transformer: data => data
})
export type UpdateGroupRoleRelationActionTypes = ValidationTypes<typeof updateGroupRoleRelationActionValidation>

export const removeGroupFromRoleActionValidation = baseGroupRoleActionValidation.createValidation({
    keys: ['groupId','roleId','forAdminsOnly'],
    transformer: data => data
})
export type RemoveGroupFromRoleActionTypes = ValidationTypes<typeof removeGroupFromRoleActionValidation>
