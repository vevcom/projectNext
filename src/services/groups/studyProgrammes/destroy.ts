import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { ExpandedStudyProgramme } from './Types'

export async function destroyStudyProgramme(id: number): Promise<ExpandedStudyProgramme> {
    return await prismaCall(() => prisma.studyProgramme.delete({
        where: {
            id,
        },
    }))
}
