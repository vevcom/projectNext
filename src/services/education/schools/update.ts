import '@pn-server-only'
import { SchoolFilteredSelection } from './ConfigVars'
import { updateSchoolValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { SchoolFiltered } from './types'
import type { UpdateSchoolTypes } from './validation'

export async function updateSchool(id: number, rawdata: UpdateSchoolTypes['Detailed']): Promise<SchoolFiltered> {
    const data = updateSchoolValidation.detailedValidate(rawdata)

    return await prismaCall(() => prisma.school.update({
        where: { id },
        data,
        select: SchoolFilteredSelection,
    }))
}
