'use server'

import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { invalidateManyUserSessionData } from '@/actions/users/update'
import { Permission } from '@prisma/client'
import { z } from 'zod'
import type { ActionReturn } from '@/actions/Typess'

export async function updateRole(data: FormData): Promise<ActionReturn<void, false>> {
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
