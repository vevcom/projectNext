import 'server-only'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { Ombul } from '@prisma/client'
import type { ExpandedOmbul } from './Types'

export async function readLatestOmbul(): Promise<ActionReturn<Ombul>> {
    try {
        const ombul = await prisma.ombul.findMany({
            orderBy: [
                { year: 'desc' },
                { issueNumber: 'desc' },
            ],
            take: 1,
        })
        if (!ombul) {
            return createActionError('NOT FOUND', 'Fant ingen ombul.')
        }
        return {
            success: true,
            data: ombul[0]
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

/**
 * A function to read one ombul
 * @param idOrNameAndYear - The id of the ombul to read, or an object with the name and year of the ombul to read
 * @returns 
 */
export async function readOmbul(idOrNameAndYear: number | {
    name: string,
    year: number,
}): Promise<ActionReturn<ExpandedOmbul>> {
    try {
        const ombul = await prisma.ombul.findUnique({
            where: typeof idOrNameAndYear === 'number' ? {
                id: idOrNameAndYear
            } : {
                year_name: {
                    name: idOrNameAndYear.name,
                    year: idOrNameAndYear.year
                }
            },
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
        if (!ombul) {
            return createActionError('NOT FOUND', 'Fant ingen ombul')
        }
        return {
            success: true,
            data: ombul
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

/**
 * A function to read all ombuls, orders by year and issue number
 * @returns - All ombuls
 */
export async function readOmbuls(): Promise<ActionReturn<ExpandedOmbul[]>> {
    try {
        const ombuls = await prisma.ombul.findMany({
            orderBy: [
                { year: 'desc' },
                { issueNumber: 'desc' },
            ],
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
        return { success: true, data: ombuls }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
