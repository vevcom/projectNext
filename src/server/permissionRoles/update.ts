import 'server-only'
import { readUsersOfRole } from './read'
import { updateRoleValidation } from './schema'
import { expandedRoleIncluder } from './ConfigVars'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { invalidateManyUserSessionData } from '@/server/auth/invalidateSession'
import type { UpdateRoleType } from './schema'
import type { ExpandedRole } from './Types'

/**
 * A function that updates a role. The given permissions will be set as the new permissions for the role.
 * All other permissions will be removed.
 * @param id - The id of the role to update
 * @param data - The new data for the role
 * @param permissions - The new permissions for the role
 */
export async function updateRole(
    rawdata: UpdateRoleType
): Promise<ExpandedRole> {
    const { id, permissions, ...data } = updateRoleValidation.detailedValidate(rawdata)
    // Update name of role
    const role = await prismaCall(() => prisma.role.update({
        where: {
            id
        },
        include: expandedRoleIncluder,
        data,
    }))

    // Delete removed permissions
    await prismaCall(() => prisma.rolePermission.deleteMany({
        where: {
            roleId: id,
            permission: {
                not: {
                    in: permissions
                }
            }
        }
    }))

    // Create added permissions
    await prismaCall(() => prisma.rolePermission.createMany({
        data: permissions.map(permission => ({
            roleId: id,
            permission,
        })),
        skipDuplicates: true
    }))

    const users = await readUsersOfRole(role.id)
    await invalidateManyUserSessionData(users.map(user => user.id))

    return role
}

/**
 * Adds a group to a role.
 * 
 * @param groupId - The id of the group to add.
 * @param roleId - The id of the role to add the group to.
 * @param forAdminsOnly - Wheter or not the role should only apply to admins of the group.
 */
export async function addGroupToRole(groupId: number, roleId: number, forAdminsOnly: boolean = false): Promise<void> {
    await prismaCall(() => prisma.rolesGroups.create({
        data: {
            groupId,
            roleId,
            forAdminsOnly,
        }
    }))
}

/**
 * Updates a relation between a group and a role.
 * 
 * @param groupId - The id of the group to add.
 * @param roleId - The id of the role to add the group to.
 * @param forAdminsOnly - Wheter or not the role should only apply to admins of the group.
 */
export async function updateGroupRoleRelation(groupId: number, roleId: number, forAdminsOnly: boolean = false): Promise<void> {
    await prismaCall(() => prisma.rolesGroups.update({
        where: {
            groupId_roleId: {
                groupId,
                roleId,
            },
        },
        data: {
            forAdminsOnly,
        }
    }))
}

/**
 * Removes a group from a role.
 * 
 * @param groupId - The id of the group to remove.
 * @param roleId - The id of the role to remove the group from.
 */
export async function removeGroupFromRole(groupId: number, roleId: number): Promise<void> {
    await prismaCall(() => prisma.rolesGroups.delete({
        where: {
            groupId_roleId: {
                groupId,
                roleId,
            },
        },
    }))
}