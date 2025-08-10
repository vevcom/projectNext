'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import {
    addGroupToRole,
    removeGroupFromRole,
    updateDefaultPermissions,
    updateGroupRoleRelation,
    updateRole
} from '@/services/permissions/update'
import {
    updateDefaultPermissionsValidation,
    updateRoleValidation,
    addGroupToRoleActionValidation,
    removeGroupFromRoleActionValidation,
    updateGroupRoleRelationActionValidation
} from '@/services/permissions/validation'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedRole } from '@/services/permissions/Types'
import type {
    UpdateRoleTypes,
    AddGroupToRoleActionTypes,
    RemoveGroupFromRoleActionTypes,
    UpdateGroupRoleRelationActionTypes,
} from '@/services/permissions/validation'
import type { Permission } from '@prisma/client'

/**
 * A function that updates a role. The given permissions will be set as the new permissions for the role.
 * All other permissions will be removed.
 * @param id - The id of the role to update
 * @param data - The new data for the role
 * @param permissions - The new permissions for the role
 */
export async function updateRoleAction(rawdata: FormData | UpdateRoleTypes['Type']): Promise<ActionReturn<ExpandedRole>> {
    //TODO: auth
    const parse = updateRoleValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateRole(data))
}

/**
 * A function that updates a role. The given permissions will be set as the new permissions for the role.
 * All other permissions will be removed.
 * @param id - The id of the role to update
 * @param data - The new data for the role
 * @param permissions - The new permissions for the role
 */
export async function updateDefaultPermissionsAction(
    rawdata: FormData | UpdateRoleTypes['Type']
): Promise<ActionReturn<Permission[]>> {
    //TODO: auth
    const parse = updateDefaultPermissionsValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateDefaultPermissions(data))
}

/**
 * Adds a group to a role.
 *
 * @param groupId - The id of the group to add.
 * @param roleId - The id of the role to add the group to.
 * @param forAdminsOnly - Wheter or not the role should only apply to admins of the group.
 */
export async function addGroupToRoleAction(
    rawData: FormData | AddGroupToRoleActionTypes['Type']
): Promise<ActionReturn<void, false>> {
    const parse = addGroupToRoleActionValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const { groupId, roleId, forAdminsOnly } = parse.data

    return await safeServerCall(() => addGroupToRole(groupId, roleId, forAdminsOnly))
}

/**
 * Updates a relation between a group and a role.
 *
 * @param groupId - The id of the group to add.
 * @param roleId - The id of the role to add the group to.
 * @param forAdminsOnly - Wheter or not the role should only apply to admins of the group.
 */
export async function updateGroupRoleRelationAction(
    rawData: FormData | UpdateGroupRoleRelationActionTypes['Type']
): Promise<ActionReturn<void, false>> {
    const parse = updateGroupRoleRelationActionValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const { groupId, roleId, forAdminsOnly } = parse.data

    return await safeServerCall(() => updateGroupRoleRelation(groupId, roleId, forAdminsOnly))
}

/**
 * Removes a group from a role.
 *
 * @param groupId - The id of the group to remove.
 * @param roleId - The id of the role to remove the group from.
 */
export async function removeGroupFromRoleAction(
    rawData: FormData | RemoveGroupFromRoleActionTypes['Type']
): Promise<ActionReturn<void, false>> {
    const parse = removeGroupFromRoleActionValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const { groupId, roleId } = parse.data

    return await safeServerCall(() => removeGroupFromRole(groupId, roleId))
}
