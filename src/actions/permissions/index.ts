'use server'

import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { Permission } from '@prisma/client'
import { z } from 'zod'
import type { ActionReturn } from '@/actions/type'
import type { Prisma, User } from '@prisma/client'

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: { select: { permission: true } } } }>

export async function readRoles() : Promise<ActionReturn<RoleWithPermissions[]>> {
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
        return errorHandeler(e)
    }
}

export async function createRole(data: FormData) : Promise<ActionReturn<RoleWithPermissions>> {
    const schema = z.object({ name: z.string() })

    const parse = schema.safeParse({
        name: data.get('name')
    })

    if (!parse.success) return { success: false, error: parse.error.issues }


    const { name } = parse.data

    if (!name) return { success: false }

    try {
        const role = await prisma.role.create({
            data: { name },
            select: {
                id: true,
                name: true,
                permissions: {
                    select: {
                        permission: true
                    }
                }
            }
        })

        return { success: true, data: role }
    } catch (e) {
        return errorHandeler(e)
    }
}

export async function updateRole(data: FormData) : Promise<ActionReturn<void, false>> {
    const schema = z.object({
        id: z.coerce.number(),
        name: z.string(),
        permissions: z.nativeEnum(Permission).array(),
    })

    const parse = schema.safeParse({
        id: data.get('id'),
        name: data.get('name'),
        permissions: data.getAll('permission'),
    })

    if (!parse.success) return { success: false, error: parse.error.issues }

    const { id, name, permissions } = parse.data

    // Update name of role
    try {
        await prisma.role.update({
            where: {
                id
            },
            data: {
                name
            },
        })
    } catch (e) {
        return errorHandeler(e)
    }

    // Delete removed permissions
    try {
        await prisma.rolePermission.deleteMany({
            where: {
                roleId: id,
                permission: {
                    not: {
                        in: permissions
                    }
                }
            }
        })
    } catch (e) {
        return errorHandeler(e)
    }

    // Create added permissions
    try {
        await prisma.rolePermission.createMany({
            data: permissions.map(permission => ({
                roleId: id,
                permission,
            })),
            skipDuplicates: true
        })
    } catch (e) {
        return errorHandeler(e)
    }

    return { success: true, data: undefined }
}

export async function destroyRole(roleId: number) : Promise<ActionReturn<RoleWithPermissions>> {
    try {
        const role = await prisma.role.delete({
            where: {
                id: roleId
            },
            select: {
                id: true,
                name: true,
                permissions: {
                    select: {
                        permission: true
                    }
                }
            }
        })

        return { success: true, data: role }
    } catch (e) {
        return errorHandeler(e)
    }
}

export async function addUserToRole(data: FormData) : Promise<ActionReturn<void, false>> {
    const schema = z.object({
        roleId: z.coerce.number(),
        username: z.string(),
    })

    const parse = schema.safeParse({
        roleId: data.get('roleId'),
        username: data.get('username'),
    })


    if (!parse.success) return { success: false, error: parse.error.issues }

    const { roleId, username } = parse.data
    console.log(roleId)

    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true
            },
        })

        if (!user) return { success: false, error: [{ message: 'Invalid username' }] }

        await prisma.rolesUsers.create({
            data: {
                roleId,
                userId: user.id,
            },
        })
    } catch (e) {
        return errorHandeler(e)
    }

    return { success: true, data: undefined }
}

export async function removeUserFromRole(data: FormData) : Promise<ActionReturn<void, false>> {
    const schema = z.object({
        roleId: z.coerce.number(),
        username: z.string(),
    })

    const parse = schema.safeParse({
        roleId: data.get('roleId'),
        username: data.get('username'),
    })

    if (!parse.success) return { success: false, error: parse.error.issues }

    const { roleId, username } = parse.data

    try {
        const user = await prisma.user.findUnique({
            where: {
                username
            },
            select: {
                id: true
            },
        })

        if (!user) return { success: false, error: [{ message: 'Invalid username' }] }

        await prisma.rolesUsers.delete({
            where: {
                userId_roleId: {
                    roleId,
                    userId: user.id
                }
            },
        })
    } catch (e) {
        return errorHandeler(e)
    }

    return { success: true, data: undefined }
}

export async function readUsersOfRole(roleId: number) : Promise<ActionReturn<User[]>> {
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
        return errorHandeler(e)
    }
}

export async function readRolesOfUser(userId: number) : Promise<ActionReturn<RoleWithPermissions[]>> {
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
        return errorHandeler(e)
    }
}

export async function readPermissionsOfUser(userId: number) : Promise<ActionReturn<Set<Permission>>> {
    const rolesResult = await readRolesOfUser(userId)

    if (!rolesResult.success) return rolesResult

    const roles = rolesResult.data

    const permissions = roles.reduce(
        (result, role) => role.permissions.map(permission => permission.permission).concat(result),
        <Permission[]>[]
    )


    return { success: true, data: new Set(permissions) }
}
