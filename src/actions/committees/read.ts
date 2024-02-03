'use server'
import { ActionReturn } from "@/actions/type"
import type { Committee } from "@prisma/client"
import errorHandler from "@/prisma/errorHandler"
import prisma from "@/prisma"

export default async function read(name: string) : Promise<ActionReturn<Committee>> {
    try {
        const committee = await prisma.committee.findUnique({
            where: {
                name
            }
        })
        if (!committee) return { success: false, error: [{message:`kommitee ${name} ikke funnet `}] }
        return { success: true, data: committee }
    } catch (error) {
        return errorHandler(error)
    }
}