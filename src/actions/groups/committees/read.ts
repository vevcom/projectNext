'use server'
import { ActionReturn } from "@/actions/Types"
import { createActionError, createPrismaActionError } from "@/actions/error"
import prisma from "@/prisma"
import { ExpandedCommittee } from "./Types"

/**
 * Reads all committees
 */
export async function readCommitees() : Promise<ActionReturn<ExpandedCommittee[]>> {
    try {
        const committees = await prisma.committee.findMany({
            include: {
                logoImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
        return { success: true, data: committees }
    } catch (error) {
        return createPrismaActionError(error)
    }

}

export async function readCommitee(name: string) : Promise<ActionReturn<ExpandedCommittee>> {
    try {
        const committee = await prisma.committee.findUnique({
            where: {
                name
            },
            include: {
                logoImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
        if (!committee) return createActionError('BAD PARAMETERS', 'Committee not found')
        return { success: true, data: committee }
    } catch (error) {
        return createPrismaActionError(error)
    }
}