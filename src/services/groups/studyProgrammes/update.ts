import { updateStudyProgrammeValidation } from './validation'
import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { UpdateStudyProgrammeTypes } from './validation'
import type { ExpandedStudyProgramme } from './types'

export async function updateStudyProgramme(
    data: UpdateStudyProgrammeTypes['Detailed']
): Promise<ExpandedStudyProgramme> {
    const parse = updateStudyProgrammeValidation.detailedValidate(data)

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
