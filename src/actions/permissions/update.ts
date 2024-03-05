'use server'

import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { invalidateManyUserSessionData } from '@/actions/users/update'
import type { ActionReturn } from '@/actions/Types'
import { UpdateRoleSchemaType, updateRoleSchema } from './schema'

export async function updateRole(rawdata: FormData | UpdateRoleSchemaType): Promise<ActionReturn<void, false>> {
    const parse = updateRoleSchema.safeParse(rawdata)

    if (!parse.success) return { success: false, error: parse.error.issues }

    const { id, name, permissions } = parse.data

    let userIds: number[]

    // Update name of role
    try {
        const role = await prisma.role.update({
            where: {
                id
            },
            data: {
                name
            },
            select: {
                users: {
                    select: {
                        userId: true,
                    },
                },
            },
        })

        userIds = role.users.map(user => user.userId)
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

    const res = await invalidateManyUserSessionData(userIds)

    if (!res.success) return res

    return { success: true }
}
