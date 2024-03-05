'use server'

import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { Permission, Prisma, User } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } }>

export async function readRoles(): Promise<ActionReturn<RoleWithPermissions[]>> {
    try {
        const roles = await prisma.role.findMany({
            include: {
                permissions: true
            },
            orderBy: {
                id: 'asc'
            }
        })

        return {
            data: roles,
            success: true,
        }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function readUsersOfRole(roleId: number): Promise<ActionReturn<User[]>> {
    try {
        const rolesUsers = await prisma.rolesUsers.findMany({
            where: {
                roleId
            },
            select: {
                user: true
            }
        })

        const users = rolesUsers.map(roleUser => roleUser.user)

        return { success: true, data: users }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function readRolesOfUser(userId: number): Promise<ActionReturn<RoleWithPermissions[]>> {
    try {
        const rolesUsers = await prisma.rolesUsers.findMany({
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
        })

        const roles = rolesUsers.map(roleUser => roleUser.role)

        return { success: true, data: roles }
    } catch (e) {
        return createPrismaActionError(e)
    }
}

export async function readPermissionsOfUser(userId: number): Promise<ActionReturn<Permission[]>> {
    const rolesResult = await readRolesOfUser(userId)

    if (!rolesResult.success) return rolesResult

    const roles = rolesResult.data

    const permissions = roles.reduce(
        (result, role) => role.permissions.map(permission => permission.permission).concat(result),
        <Permission[]>[]
    )


    return { success: true, data: permissions }
}
