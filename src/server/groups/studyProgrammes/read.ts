import { prismaCall } from "@/server/prismaCall";
import { ExpandedStudyProgramme } from "./Types";
import prisma from '@/prisma'

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