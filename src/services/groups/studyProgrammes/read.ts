import { prismaCall } from '@/services/prismaCall'
import { prisma } from '@/prisma-pn-client-instance'
import type { ExpandedStudyProgramme } from './types'

export async function readStudyProgrammes(): Promise<ExpandedStudyProgramme[]> {
    return await prismaCall(() => prisma.studyProgramme.findMany())
}

export async function readStudyProgramme(id: number): Promise<ExpandedStudyProgramme> {
    return await prismaCall(() => prisma.studyProgramme.findUniqueOrThrow({
        where: {
            id,
        },
    }))
}
