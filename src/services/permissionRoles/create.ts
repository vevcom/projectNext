import 'server-only'
import { createRoleValidation } from './validation'
import { expandedRoleIncluder } from './ConfigVars'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { CreateRoleTypes } from './validation'
import type { ExpandedRole } from './Types'

export async function createRole(rawdata: CreateRoleTypes['Detailed']): Promise<ExpandedRole> {
    const data = createRoleValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.role.create({
        data,
        include: expandedRoleIncluder,
    }))
}
