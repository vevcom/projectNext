import { prismaCall } from "@/server/prismaCall";
import { ExpandedStudyProgramme } from "./Types";
import prisma from '@/prisma'

type UpdateStudyProgrammeArgs = {
    code?: string,
    name?: string,
    instituteCode?: string,
    startYear?: number,
    yearsLength?: number,
}

export async function updateStudyProgramme(id: number, data: UpdateStudyProgrammeArgs): Promise<ExpandedStudyProgramme> {
    return prismaCall(() => prisma.studyProgramme.update({
        where: {
            id,
        },
        data,
    }))
}