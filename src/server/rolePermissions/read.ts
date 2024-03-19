import 'server-only'
import { readMembershipsOfUser, readUsersOfMemberships } from '@/server/groups/read'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { Prisma } from '@prisma/client'
import type { User } from '@/prisma/prismaservice/generated/pn'
import type { BasicMembership } from '@/server/groups/Types'
import type { Permission, RolesGroups, SpecialRole } from '@prisma/client'
import type { ExpandedRole } from '@/server/rolePermissions/Types'

const expandedRoleIncluder = Prisma.validator<Prisma.RoleInclude>()({
    permissions: {
        select: {
            permission: true,
        },
    },
    groups: {
        select: {
            groupId: true,
            forAdminsOnly: true,
        },
    },
})

export async function readRoles(): Promise<ExpandedRole[]> {
    return await prismaCall(() => prisma.role.findMany({
        include: expandedRoleIncluder,
        orderBy: [
            { id: 'asc' },
            { special: 'asc' },
        ]
    }))
}

export async function readSpecialRole(special: SpecialRole): Promise<ExpandedRole | null> {
    return await prismaCall(() => prisma.role.findUnique({
        where: {
            special,
        },
        include: expandedRoleIncluder,
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

    const defaultRole = await readSpecialRole('DEFAULT')

    if (defaultRole) {
        rolesGroups.push({
            role: defaultRole,
        })
    }

    return rolesGroups.map(roleGroup => roleGroup.role)
}

export async function readRolesOfMemberships(data: BasicMembership[]): Promise<ExpandedRole[]> {
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
