import '@pn-server-only'
import { expandedRoleIncluder } from './config'
import { readMembershipsOfUser } from '@/services/groups/memberships/read'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import { GroupMethods } from '@/services/groups/methods'
import type { Permission, RolesGroups } from '@prisma/client'
import type { MembershipFiltered } from '@/services/groups/memberships/Types'
import type { ExpandedRole } from '@/services/permissions/Types'
import type { UserFiltered } from '@/services/users/Types'

export async function readRoles(): Promise<ExpandedRole[]> {
    return await prismaCall(() => prisma.role.findMany({
        include: expandedRoleIncluder,
        orderBy: {
            id: 'asc',
        },
    }))
}

export async function readGroupsOfRole(roleId: number): Promise<RolesGroups[]> {
    return await prismaCall(() => prisma.rolesGroups.findMany({
        where: {
            roleId,
        },
    }))
}

export async function readRolesOfGroup(groupId: number, admin: boolean = false): Promise<ExpandedRole[]> {
    const rolesGroups = await prismaCall(() => prisma.rolesGroups.findMany({
        where: {
            groupId,
            forAdminsOnly: admin !== true ? false : undefined,
        },
        select: {
            role: {
                include: expandedRoleIncluder
            },
        },
    }))

    return rolesGroups.map(roleGroup => roleGroup.role)
}

export async function readRolesOfMemberships(data: MembershipFiltered[]): Promise<ExpandedRole[]> {
    const rolesGroups = await prismaCall(() => prisma.rolesGroups.findMany({
        where: {
            OR: data.map(({ groupId, admin }) => ({
                groupId,
                forAdminsOnly: admin === false ? false : undefined,
            })),
        },
        select: {
            role: {
                include: expandedRoleIncluder
            },
        },
    }))

    return rolesGroups.map(roleGroup => roleGroup.role)
}

export async function readRolesOfUser(userId: number): Promise<ExpandedRole[]> {
    const memberships = await readMembershipsOfUser(userId)

    return await readRolesOfMemberships(memberships)
}

export async function readPermissionsOfUser(userId: number): Promise<Permission[]> {
    const roles = await readRolesOfUser(userId)

    const userPermissions = roles.reduce(
        (result, role) => role.permissions.map(permission => permission.permission).concat(result),
        <Permission[]>[]
    )
    const defaultPermissions = await readDefaultPermissions()
    const allPermissions = userPermissions.concat(defaultPermissions)

    // Remove duplicates
    return allPermissions.filter((permission, index) => allPermissions.indexOf(permission) === index)
}

export async function readDefaultPermissions(): Promise<Permission[]> {
    const defaultPermissions = await prismaCall(() => prisma.defaultPermission.findMany({}))

    return defaultPermissions.map(({ permission }) => permission)
}

export async function readUsersOfRole(id: number): Promise<UserFiltered[]> {
    const groups = await readGroupsOfRole(id)

    const result = await GroupMethods.readUsersOfGroups.newClient().execute({
        session: null,
        bypassAuth: true,
        params: {
            groups: groups.map(({ forAdminsOnly, groupId }) => ({
                admin: forAdminsOnly,
                groupId,
            })),
        }
    })

    return result
}
