'use server'

import { StudyProgram } from "@prisma/client";
import { ActionReturn } from "../type";
import errorHandler from "@/prisma/errorHandler";
import prisma from "@/prisma";

export default async function read(studyProgramId: Number) : Promise<ActionReturn<StudyProgram>> {
    try {
        const results = await prisma.studyProgram.findUnique({
            where: {
                id: Number(studyProgramId)
            }
        })

        if(!results) {
            return {
                success: false,
                error: [{
                    message: `404: Study program with id ${studyProgramId} not found`
                }]
            }
        }

        return { success: true, data: results }
    } catch (error) {
        return errorHandler(error)
    }
}