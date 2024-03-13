import 'server-only'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import { invalidateOneUserSessionData } from '@/server/auth/invalidateSession'
import type { ActionReturn } from '@/actions/Types'
import type {  RoleWithPermissions } from './Types'

export async function createRole(data: { name: string }): Promise<ActionReturn<RoleWithPermissions>> {
    try {
        const role = await prisma.role.create({
            data,
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
        return createPrismaActionError(e)
    }
}