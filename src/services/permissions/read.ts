import '@pn-server-only'
import { expandedRoleIncluder } from './config'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import { GroupMethods } from '@/services/groups/methods'
import type { Permission, RolesGroups } from '@prisma/client'
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
