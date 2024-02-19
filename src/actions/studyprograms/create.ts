'use server'
import type { StudyProgram } from "@prisma/client";
import type { ActionReturn } from "../type";
import prisma from "@/prisma";
import errorHandler from "@/prisma/errorHandler";

type PropType = {
    name: string,
    code: string,
    years?: number,
}

export async function upsert({name, code, years} : PropType) : Promise<ActionReturn<StudyProgram>> {
    try {
        const results = await prisma.studyProgram.upsert({
            where: {
                code
            },
            create: {
                name, 
                code,
                years
            },
            update: {}
        })

        return { success: true, data: results }
    } catch (error) {
        return errorHandler(error)
    }
}