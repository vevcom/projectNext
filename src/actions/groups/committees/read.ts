'use server'
import { ActionReturn } from "@/actions/Types"
import { createActionError, createPrismaActionError } from "@/actions/error"
import prisma from "@/prisma"
import { ExpandedCommittee } from "./Types"

export default async function readCommitee(name: string) : Promise<ActionReturn<ExpandedCommittee>> {
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