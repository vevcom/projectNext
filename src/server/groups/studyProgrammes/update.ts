import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedStudyProgramme } from './Types'
import { UpdateStudyProgramTypes, updateStudyProgramValidation } from './validation'

export async function updateStudyProgramme(data: UpdateStudyProgramTypes['Detailed']): Promise<ExpandedStudyProgramme> {
    const parse = updateStudyProgramValidation.detailedValidate(data)

    return prismaCall(() => prisma.studyProgramme.update({
        where: {
            id: parse.id,
        },
        data: {
            ...parse,
            id: undefined,
        },
    }))
}
