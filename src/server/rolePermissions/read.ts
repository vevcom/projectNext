import 'server-only'
import { readMembershipsOfUser, readUsersOfMemberships } from '@/server/groups/read'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { Prisma } from '@prisma/client'
import type { User } from '@/prisma/prismaservice/generated/pn'
import type { BasicMembership } from '@/server/groups/Types'
import type { Permission, RolesGroups, SpecialRole } from '@prisma/client'
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

export async function readGroupsOfRole(roleId: number): Promise<RolesGroups[]> {
    return await prismaCall(() => prisma.rolesGroups.findMany({
        where: {
            roleId,
        },
    }))
}

export async function readRolesOfGroup(groupId: number, admin: boolean = false): Promise<RoleWithPermissions[]> {
    const rolesGroups = await prismaCall(() => prisma.rolesGroups.findMany({
        where: {
            groupId,
            forAdminsOnly: admin !== true ? false : undefined,
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

export async function readRolesOfMemberships(data: BasicMembership[]): Promise<RoleWithPermissions[]> {    
    const rolesGroups = await prismaCall(() => prisma.rolesGroups.findMany({
        where: {
            OR: data.map(({ groupId, admin }) => ({
                groupId,
                forAdminsOnly: admin,
            })),
        },
        select: {
            role: {
                include: rolePermissionInclude
            },
        },
    }))

    return rolesGroups.map(roleGroup => roleGroup.role)
}

export async function readRolesOfUser(userId: number): Promise<RoleWithPermissions[]> {
    const memberships = await readMembershipsOfUser(userId)

    return await readRolesOfMemberships(memberships)
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

export async function readUsersOfRole(id: number): Promise<User[]> {
    const groups = await readGroupsOfRole(id)

    const memberships = groups.map(({ forAdminsOnly, groupId }) => ({
        groupId,
        admin: forAdminsOnly,
    }))

    return await readUsersOfMemberships(memberships)
}
