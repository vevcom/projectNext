import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { Prisma } from '@prisma/client'
import type { Permission, SpecialRole, User } from '@prisma/client'
import type { RoleWithPermissions } from '@/server/rolePermissions/Types'
import { ExpandedGroup } from '../groups/Types'
import { readMembershipsOfUser } from '../groups/read'

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

export async function readSepcialRole(special: SpecialRole): Promise<RoleWithPermissions> {
    return await prismaCall(() => prisma.role.findUniqueOrThrow({
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

    rolesGroups.push({
        role: await readSepcialRole('DEFAULT')
    })

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
    const permissions = roles.reduce(
        (result, role) => role.permissions.map(permission => permission.permission).concat(result),
        <Permission[]>[]
    )
    return permissions
}
