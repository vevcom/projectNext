'use server'

import { ActionReturn } from '@/actions/type'
import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { z } from 'zod'

import type { Prisma } from '@prisma/client'

type RoleWithPermissions = Prisma.RoleGetPayload<{include: { permissions: true } }>

export async function readRoles() : Promise<ActionReturn<RoleWithPermissions[]>> {
    try {
        const roles = await prisma.role.findMany({
            include: {
                permissions: true
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

export async function createRole(data: FormData) : Promise<ActionReturn<void, false>> {
    const schema = z.object({ name: z.string() })

    const parse = schema.safeParse({
        name: data.get('name')
    })

    if (!parse.success) return { success: false, error: parse.error.issues }


    const { name } = parse.data

    if (!name) return { success: false }

    try {
        await prisma.role.create({ data: { name } })
    } catch (e) {
        return errorHandeler(e)
    }

    return { success: true, data: undefined }
}

export async function destroyRole(roleId: number) : Promise<ActionReturn<void, false>> {
    try {
        await prisma.role.delete({
            where: {
                id: roleId
            }
        })
    } catch (e) {
        return errorHandeler(e)
    }

    return { success: true, data: undefined }
}
