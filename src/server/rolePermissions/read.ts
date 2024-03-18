import 'server-only'
import { readMembershipsOfUser } from '@/server/groups/read'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { Prisma } from '@prisma/client'
import type { ExpandedGroup } from '@/server/groups/Types'
import type { Permission, SpecialRole } from '@prisma/client'
import type { RoleWithPermissions } from '@/server/rolePermissions/Types'

const rolePermissionInclude = Prisma.validator<Prisma.RoleInclude>()({
    permissions: {
        select: {
            permission: true,
        },
    },
})

export async function readRoles(): Promise<RoleWithPermissions[]> {
    return await prismaCall(() => prisma.role.findMany({
        include: {
            permissions: true
        },
        orderBy: {
            id: 'asc'
        }
    }))
}

export async function readSpecialRole(special: SpecialRole): Promise<RoleWithPermissions | null> {
    return await prismaCall(() => prisma.role.findUnique({
        where: {
            special,
        },
        include: rolePermissionInclude,
    }))
}

export async function readGroupsOfRole(roleId: number): Promise<ExpandedGroup[]> {
    const rolesGroups = await prismaCall(() => prisma.rolesGroups.findMany({
        where: {
            roleId
        },
        include: {
            group: true
        }
    }))

    return rolesGroups.map(roleGroup => roleGroup.group)
}

export async function readRolesOfGroup(groupId: number): Promise<RoleWithPermissions[]> {
    const rolesGroups = await prismaCall(() => prisma.rolesGroups.findMany({
        where: {
            groupId
        },
        select: {
            role: {
                include: rolePermissionInclude
            },
        },
    }))

    const defaultRole = await readSpecialRole('DEFAULT')

    if (defaultRole) {
        rolesGroups.push({
            role: defaultRole,
        })
    }

    return rolesGroups.map(roleGroup => roleGroup.role)
}

export async function readRolesOfGroups(groupIds: number[]): Promise<RoleWithPermissions[]> {
    const rolesGroups = await prismaCall(() => prisma.rolesGroups.findMany({
        where: {
            groupId: {
                in: groupIds,
            },
        },
        select: {
            role: {
                include: rolePermissionInclude
            },
        },
    }))

    const roles = rolesGroups.map(roleGroup => roleGroup.role)

    return roles
}

export async function readRolesOfUser(userId: number): Promise<RoleWithPermissions[]> {
    const memberships = await readMembershipsOfUser(userId)

    return await readRolesOfGroups(memberships.map(membership => membership.groupId))
}

export async function readPermissionsOfUser(userId: number): Promise<Permission[]> {
    const roles = await readRolesOfUser(userId)
    return roles.reduce(
        (result, role) => role.permissions.map(permission => permission.permission).concat(result),
        <Permission[]>[]
    )
}

export async function readPermissionsOfDefaultUser(): Promise<Permission[]> {
    const role = await readSpecialRole('DEFAULT')

    if (!role) return []

    return role.permissions.map(permission => permission.permission)
}
