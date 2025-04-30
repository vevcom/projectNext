import '@pn-server-only'
import { ServerError } from '@/services/error'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { Ombul } from '@prisma/client'
import type { ExpandedOmbul } from './Types'

export async function readLatestOmbul(): Promise<Ombul> {
    const ombul = await prisma.ombul.findMany({
        orderBy: [
            { year: 'desc' },
            { issueNumber: 'desc' },
        ],
        take: 1,
    })
    if (!ombul) throw new ServerError('NOT FOUND', 'Fant ingen ombul.')
    return ombul[0]
}

/**
 * A function to read one ombul
 * @param idOrNameAndYear - The id of the ombul to read, or an object with the name and year of the ombul to read
 * @returns
 */
export async function readOmbul(idOrNameAndYear: number | {
    name: string,
    year: number,
}): Promise<ExpandedOmbul> {
    const ombul = await prismaCall(() => prisma.ombul.findUnique({
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
    }))
    if (!ombul) throw new ServerError('NOT FOUND', 'Fant ingen ombul')

    return ombul
}

/**
 * A function to read all ombuls, orders by year and issue number
 * @returns - All ombuls
 */
export async function readOmbuls(): Promise<ExpandedOmbul[]> {
    return await prismaCall(() => prisma.ombul.findMany({
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
    }))
}
