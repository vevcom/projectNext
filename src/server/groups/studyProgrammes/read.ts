import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedStudyProgramme } from './Types'

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
