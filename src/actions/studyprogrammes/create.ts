'use server'
import type { ActionReturn } from "../Types";
import prisma from "@/prisma";
import errorHandler from "@/prisma/errorHandler";
import { StudyProgram } from "@prisma/client";

type PropType = {
    name: string,
    code: string,
}

type ReturnStudyProgram = {
    id: number,
    name: string,
    code: string,
    startYear: number,
    insititueCode: String | null,
    yearsLength: number | null,
    newStudyProgram: boolean,
}

type PrismaResults = StudyProgram & { role: {name: string}}

function unpackResults(newStudyProgram: boolean) {
    return (p : PrismaResults) : ReturnStudyProgram => ({
        id: p.id,
        name: p.role.name,
        code: p.code,
        startYear: p.startYear,
        insititueCode: p.insititueCode,
        yearsLength: p.yearsLength,
        newStudyProgram,
    });
};

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

export async function upsertManyStudyProgrammes(programs : Array<PropType>) : Promise<ActionReturn<Array<ReturnStudyProgram>>> {
    if (programs.length === 0) return { success: true, data: [] }

    try {
        const exists = await prisma.studyProgram.findMany({
            where: {
                code: {
                    in: programs.map(program => program.code)
                }
            },
            select: returnSelections
        });

        const existingStudyCodes = new Set(exists.map(program => program.code))
        const newStudyPrograms = programs.filter(program => !existingStudyCodes.has(program.code))
        let createdStudyPrograms : Array<PrismaResults> | null = [];

        if (newStudyPrograms.length > 0) {
            createdStudyPrograms = await prisma.$transaction(
                newStudyPrograms.map(program => prisma.role.create({
                    data: {
                        name: `STUDIE/${program.name}`,
                        studyProgram: {
                            create: {
                                code: program.code,
                            }
                        }
                    },
                    select: returnSelections
                }))
            ) || [];
            
        }

        const allStudyPrograms = exists
            .map(unpackResults(false))
            .concat(createdStudyPrograms
                .map(unpackResults(true))
            );

        return { success: true, data: allStudyPrograms}
    } catch (error) {
        return errorHandler(error)
    }
}