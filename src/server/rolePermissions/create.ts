import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { RoleWithPermissions } from './Types'
import { CreateRoleType, createRoleValidation } from './schema'

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
