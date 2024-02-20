'use server'

import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { Permission } from '@prisma/client'
import { z } from 'zod'
import type { ActionReturn } from '@/actions/type'

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

    return { success: true }
}
