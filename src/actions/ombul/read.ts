'use server'
import { Ombul } from "@prisma/client";
import { ActionReturn } from "@/actions/Types";
import prisma from "@/prisma";
import errorHandler from "@/prisma/errorHandler";

export async function readLatestOmbul() : Promise<ActionReturn<Ombul>> {
    try {
        const ombul = await prisma.ombul.findMany({
            orderBy: [
                { year: 'desc' },
                { issueNumber: 'desc' },
            ],
            take: 1,
        })
        console.log(ombul[0])
        if (!ombul) {
            return {
                success: false,
                error: [{
                    message: 'Fant ingen ombul'
                }]
            }
        }
        return {
            success: true,
            data: ombul[0]
        }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function readOmbuls() : Promise<ActionReturn<Ombul[]>> {
    try {
        const ombuls = await prisma.ombul.findMany()
        return { success: true, data: ombuls }
    } catch (error) {
        return errorHandler(error)
    }
}