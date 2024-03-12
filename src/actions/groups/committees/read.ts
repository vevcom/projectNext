'use server'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ExpandedCommittee } from './Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * Reads all committees
 */
export async function readCommittees(): Promise<ActionReturn<ExpandedCommittee[]>> {
    // TODO: This should be protected by a permission

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

export async function readCommittee(name: string): Promise<ActionReturn<ExpandedCommittee>> {
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
