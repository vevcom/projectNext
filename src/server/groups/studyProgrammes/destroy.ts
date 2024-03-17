import { prismaCall } from "@/server/prismaCall";
import { ExpandedStudyProgramme } from "./Types";
import prisma from '@/prisma'

export async function destroyStudyProgramme(id: number): Promise<ExpandedStudyProgramme> {
    return await prismaCall(() => prisma.studyProgramme.delete({
        where: {
            id,
        },
    }))
}