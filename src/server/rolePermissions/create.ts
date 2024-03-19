import 'server-only'
import { createRoleValidation } from './schema'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { CreateRoleType } from './schema'
import type { RoleWithPermissions } from './Types'

export async function createRole(rawdata: CreateRoleType): Promise<RoleWithPermissions> {
    const data = createRoleValidation.detailedValidate(rawdata)
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
