import 'server-only'
import prisma from '@/prisma'
import type { StudyProgram } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import { createPrismaActionError } from '@/actions/error'

type ReturnStudyProgram = {
    id: number,
    name: string,
    code: string,
    startYear: number,
    insititueCode: string | null,
    yearsLength: number | null,
    newStudyProgram: boolean,
}

type PrismaResults = StudyProgram & { role: {name: string}}

function unpackResults(newStudyProgram: boolean) {
    return (p: PrismaResults): ReturnStudyProgram => ({
        id: p.id,
        name: p.role.name,
        code: p.code,
        startYear: p.startYear,
        insititueCode: p.insititueCode,
        yearsLength: p.yearsLength,
        newStudyProgram,
    })
}

const returnSelections = {
    id: true,
    code: true,
    startYear: true,
    yearsLength: true,
    insititueCode: true,
    role: {
        select: {
            name: true,
        }
    }
}

export async function upsertManyStudyProgrammes(
    programs: {
        name: string,
        code: string,
    }[]
): Promise<ActionReturn<ReturnStudyProgram[]>> {
    if (programs.length === 0) return { success: true, data: [] }

    try {
        const exists = await prisma.studyProgram.findMany({
            where: {
                code: {
                    in: programs.map(program => program.code)
                }
            },
            select: returnSelections
        })

        const existingStudyCodes = new Set(exists.map(program => program.code))
        const newStudyPrograms = programs.filter(program => !existingStudyCodes.has(program.code))
        let createdStudyPrograms: {studyProgram: PrismaResults}[] = []

        if (newStudyPrograms.length) {
            createdStudyPrograms = (await prisma.$transaction(
                newStudyPrograms.map(program => prisma.role.create({
                    data: {
                        name: `STUDIE/${program.name}`,
                        studyProgram: {
                            create: {
                                code: program.code,
                            }
                        }
                    },
                    select: {
                        studyProgram: {
                            select: returnSelections
                        }
                    }
                }))
            ) || []).filter(p => p !== null) as {studyProgram: PrismaResults}[]
        }

        const allStudyPrograms = exists
            .map(unpackResults(false))
            .concat(createdStudyPrograms
                .map(result => result.studyProgram)
                .map(unpackResults(true))
            )

        return { success: true, data: allStudyPrograms }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
