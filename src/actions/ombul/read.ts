'use server'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import { getUser } from '@/auth'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedOmbul } from './Types'
import type { Ombul } from '@prisma/client'

export async function readLatestOmbul(): Promise<ActionReturn<Ombul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMBUL_READ']
    })
    if (!authorized) {
        return createActionError(status)
    }
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

export async function readOmbul(idOrNameAndYear: number | {
    name: string,
    year: number,
}): Promise<ActionReturn<ExpandedOmbul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMBUL_READ']
    })
    if (!authorized) {
        return createActionError(status)
    }
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

export async function readOmbuls(): Promise<ActionReturn<ExpandedOmbul[]>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMBUL_READ']
    })
    if (!authorized) {
        return createActionError(status)
    }

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
