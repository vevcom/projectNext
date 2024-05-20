import { createStudyProgramValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { CreateStudyProgramTypes } from './validation'
import type { ExpandedStudyProgramme } from './Types'

export async function createStudyProgramme(data: CreateStudyProgramTypes['Detailed']): Promise<ExpandedStudyProgramme> {
    const parse = createStudyProgramValidation.detailedValidate(data)

    return await prismaCall(() => prisma.studyProgramme.create({
        data: {
            ...parse,
            group: {
                create: {
                    groupType: 'STUDY_PROGRAMME',
                    membershipRenewal: true,
                }
            }
        }
    }))
}

export async function upsertStudyProgrammes(
    programmes: CreateStudyProgramTypes['Detailed'][]
): Promise<ExpandedStudyProgramme[]> {
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
