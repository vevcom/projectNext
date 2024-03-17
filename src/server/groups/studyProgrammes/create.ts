import { prismaCall } from "@/server/prismaCall";
import { ExpandedStudyProgramme } from "./Types";
import prisma from '@/prisma'

type CreateStudyProgrammeArgs = {
    code: string,
    name: string,
    instituteCode?: string,
    startYear?: number,
    yearsLength?: number,
}

export async function createStudyProgramme(data: CreateStudyProgrammeArgs): Promise<ExpandedStudyProgramme> {
    return await prismaCall(() => prisma.studyProgramme.create({
        data: {
            ...data,
            group: {
                create: {
                    groupType: 'STUDY_PROGRAMME',
                    membershipRenewal: true,
                }
            }
        }
    }))
}