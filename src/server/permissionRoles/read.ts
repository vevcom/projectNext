import 'server-only'
import { expandedRoleIncluder } from './ConfigVars'
import { readUsersOfGroups } from '@/server/groups/read'
import { readMembershipsOfUser } from '@/server/groups/memberships/read'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { User } from '@/prisma/prismaservice/generated/pn'
import type { MembershipFiltered } from '@/server/groups/memberships/Types'
import type { Permission, RolesGroups } from '@prisma/client'
import type { ExpandedRole } from '@/server/permissionRoles/Types'

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

export async function readUsersOfRole(id: number): Promise<User[]> {
    const groups = await readGroupsOfRole(id)

    return await readUsersOfGroups(groups.map(({ forAdminsOnly, groupId }) => ({
        admin: forAdminsOnly,
        groupId,
    })))
}
