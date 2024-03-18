import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { RoleWithPermissions } from './Types'

export async function createRole(data: { name: string }): Promise<RoleWithPermissions> {
    return await prismaCall(() => prisma.role.create({
        data,
        include: {
            permissions: {
                select: {
                    permission: true
                }
            }
        }
    }))
}
