import 'server-only'
import { SchoolFilteredSelection } from './ConfigVars'
import { updateSchoolValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { SchoolFiltered } from './Types'
import type { UpdateSchoolTypes } from './validation'

export async function updateSchool(id: number, rawdata: UpdateSchoolTypes['Detailed']): Promise<SchoolFiltered> {
    const data = updateSchoolValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.school.update({
        where: { id },
        data,
        select: SchoolFilteredSelection,
    }))
}
