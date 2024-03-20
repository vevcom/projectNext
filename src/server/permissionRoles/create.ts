import 'server-only'
import { createRoleValidation } from './schema'
import { expandedRoleIncluder } from './ConfigVars'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { CreateRoleType } from './schema'
import type { ExpandedRole } from './Types'

export async function createRole(rawdata: CreateRoleType): Promise<ExpandedRole> {
    const data = createRoleValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.role.create({
        data,
        include: expandedRoleIncluder,
    }))
}
