'use server'
import { ActionReturn } from "@/actions/Types"
import type { Committee } from "@prisma/client"
import { createActionError, createPrismaActionError } from "@/actions/error"
import prisma from "@/prisma"

export default async function readCommitee(name: string) : Promise<ActionReturn<Committee>> {
    try {
        const committee = await prisma.committee.findUnique({
            where: {
                name
            }
        })
        if (!committee) return createActionError('BAD PARAMETERS', "Committee not found")
        return { success: true, data: committee }
    } catch (error) {
        return createPrismaActionError(error)
    }
}