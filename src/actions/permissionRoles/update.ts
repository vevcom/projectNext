'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { addGroupToRole, removeGroupFromRole, updateDefaultPermissions, updateGroupRoleRelation, updateRole } from '@/server/permissionRoles/update'
import { updateDefaultPermissionsValidation, updateRoleValidation } from '@/server/permissionRoles/schema'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateRoleType } from '@/server/permissionRoles/schema'
import type { ExpandedRole } from '@/server/permissionRoles/Types'
import { AddGroupToRoleActionType, RemoveGroupFromRoleActionType, UpdateGroupRoleRelationActionType, addGroupToRoleActionValidation, removeGroupFromRoleActionValidation, updateGroupRoleRelationActionValidation } from './schema'
import { Permission } from '@prisma/client'

/**
 * A function that updates a role. The given permissions will be set as the new permissions for the role.
 * All other permissions will be removed.
 * @param id - The id of the role to update
 * @param data - The new data for the role
 * @param permissions - The new permissions for the role
 */
export async function updateRoleAction(rawdata: FormData | UpdateRoleType): Promise<ActionReturn<ExpandedRole>> {
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
export async function updateDefaultPermissionsAction(rawdata: FormData | UpdateRoleType): Promise<ActionReturn<Permission[]>> {
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
    rawData: FormData | AddGroupToRoleActionType
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
    rawData: FormData | UpdateGroupRoleRelationActionType
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
    rawData: FormData | RemoveGroupFromRoleActionType
): Promise<ActionReturn<void, false>> {
    const parse = removeGroupFromRoleActionValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const { groupId, roleId } = parse.data

    return await safeServerCall(() => removeGroupFromRole(groupId, roleId))
}