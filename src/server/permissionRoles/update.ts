import 'server-only'
import { readDefaultPermissions, readUsersOfRole } from './read'
import { updateDefaultPermissionsValidation, updateRoleValidation } from './schema'
import { expandedRoleIncluder } from './ConfigVars'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { invalidateManyUserSessionData } from '@/server/auth/invalidateSession'
import type { UpdateDefaultPermissionsType, UpdateRoleType } from './schema'
import type { ExpandedRole } from './Types'
import { Permission } from '@prisma/client'
import { readMembershipsOfGroup } from '../groups/read'

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
 * A function that updates the default permissions.
 * The given permissions will be set as the new default permissions.
 * All other permissions will be removed.
 * @param data - The new data for the role
 * @param permissions - The new permissions for the role
 */
export async function updateDefaultPermissions(
    rawdata: UpdateDefaultPermissionsType
): Promise<Permission[]> {
    const { permissions } = updateDefaultPermissionsValidation.detailedValidate(rawdata)

    // Delete removed permissions
    await prismaCall(() => prisma.defaultPermission.deleteMany({
        where: {
            permission: {
                not: {
                    in: permissions
                }
            }
        }
    }))

    // Create added permissions
    await prismaCall(() => prisma.defaultPermission.createMany({
        data: permissions.map(permission => ({
            permission,
        })),
        skipDuplicates: true
    }))

    const allUsers = await prismaCall(() => prisma.user.findMany({
        select: {
            id: true,
        }
    }))

    // Invalidate all user sessions
    await invalidateManyUserSessionData(allUsers.map(user => user.id))

    return await readDefaultPermissions()
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
    
    const memberships = await readMembershipsOfGroup(groupId) 
    await invalidateManyUserSessionData(memberships.map(membership => membership.userId))
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
    
    const memberships = await readMembershipsOfGroup(groupId) 
    await invalidateManyUserSessionData(memberships.map(membership => membership.userId))
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
    
    const memberships = await readMembershipsOfGroup(groupId) 
    await invalidateManyUserSessionData(memberships.map(membership => membership.userId))
}