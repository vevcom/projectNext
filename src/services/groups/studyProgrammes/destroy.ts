import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma/client'
import type { ExpandedStudyProgramme } from './types'

export async function destroyStudyProgramme(id: number): Promise<ExpandedStudyProgramme> {
    return await prismaCall(() => prisma.studyProgramme.delete({
        where: {
            id,
        },
    }))
}
