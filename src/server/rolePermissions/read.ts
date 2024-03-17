import 'server-only'
import prisma from '@/prisma'
import type { Permission, User } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { RoleWithPermissions } from '@/server/rolePermissions/Types'
import { prismaCall } from '../prismaCall'

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

export async function readUsersOfRole(roleId: number): Promise<User[]> {
    const rolesUsers = await prismaCall(() => prisma.rolesUsers.findMany({
        where: {
            roleId
        },
        select: {
            user: true
        }
    }))

    const users = rolesUsers.map(roleUser => roleUser.user)

    return users
}


export async function readRolesOfUser(userId: number): Promise<RoleWithPermissions[]> {
    const rolesUsers = await prismaCall(() => prisma.rolesUsers.findMany({
        where: {
            userId
        },
        select: {
            role: {
                select: {
                    id: true,
                    name: true,
                    permissions: {
                        select: {
                            permission: true
                        }
                    }
                }
            }
        }
    }))
    const roles = rolesUsers.map(roleUser => roleUser.role)
    return roles
}

export async function readPermissionsOfUser(userId: number): Promise<ActionReturn<Permission[]>> {
    const roles = await readRolesOfUser(userId)
    const permissions = roles.reduce(
        (result, role) => role.permissions.map(permission => permission.permission).concat(result),
        <Permission[]>[]
    )
    return { success: true, data: permissions }
}

