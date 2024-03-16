import 'server-only'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import { createFile } from '@/server/store/createFile'
import { destroyFile } from '@/server/store/destroyFile'
import type { Prisma } from '@prisma/client'
import type { ExpandedOmbul } from './Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * A function Update an ombul
 * @param id - The id of the ombul to update
 * @param data - The new data for the ombul including: name, year, issueNumber, description. ....
 * @returns The updated ombul
 */
export async function updateOmbul(
    id: number,
    data: Prisma.OmbulUpdateInput
): Promise<ActionReturn<ExpandedOmbul>> {
    try {
        const ombul = await prisma.ombul.update({
            where: {
                id
            },
            data,
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })
        return {
            success: true,
            data: ombul
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

/**
 * Update the ombul file (i.e. the pdf file) of an ombul
 * @param id - The id of the ombul to update
 * @param file - The new file for the ombul (pdf file)
 * @returns The updated ombul
 */
export async function updateOmbulFile(
    id: number,
    file: File,
): Promise<ActionReturn<ExpandedOmbul>> {
    const ret = await createFile(file, 'ombul', ['pdf'])
    if (!ret.success) return ret
    const fsLocation = ret.data.fsLocation

    const ombul = await prisma.ombul.findUnique({
        where: {
            id
        }
    })
    if (!ombul) {
        return createActionError('NOT FOUND', 'Ombul ikke funnet')
    }

    const oldFsLocation = ombul.fsLocation

    try {
        const ombulUpdated = await prisma.ombul.update({
            where: {
                id
            },
            data: {
                fsLocation
            },
            include: {
                coverImage: {
                    include: {
                        image: true
                    }
                }
            }
        })

        //delete the old file
        const delRet = await destroyFile('ombul', oldFsLocation)
        if (!delRet.success) return delRet

        return {
            success: true,
            data: ombulUpdated
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
