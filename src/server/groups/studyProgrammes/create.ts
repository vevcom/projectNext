import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ExpandedStudyProgramme } from './Types'

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

export async function upsertStudyProgrammes(programmes: CreateStudyProgrammeArgs[]): Promise<ExpandedStudyProgramme[]> {
    if (programmes.length === 0) return []

    const existingStudyProgrammes = await prismaCall(() => prisma.studyProgramme.findMany({
        where: {
            code: {
                in: programmes.map(programme => programme.code)
            }
        },
    }))

    const existingStudyCodes = new Set(existingStudyProgrammes.map(programme => programme.code))
    const newStudyProgrammes = programmes.filter(programme => !existingStudyCodes.has(programme.code))

    if (newStudyProgrammes.length === 0) {
        return existingStudyProgrammes
    }

    const createdStudyProgrammes = await prismaCall(() => (
        prisma.$transaction(
            newStudyProgrammes.map(programme => (
                prisma.studyProgramme.create({
                    data: {
                        ...programme,
                        group: {
                            create: {
                                groupType: 'STUDY_PROGRAMME',
                                membershipRenewal: true,
                            },
                        },
                    },
                })
            ))
        )
    ))

    return existingStudyProgrammes.concat(createdStudyProgrammes)
}
