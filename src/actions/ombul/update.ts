'use server'
import { updateOmbulSchema, updateObuleFileSchema } from './schema'
import { createActionError, createPrismaActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth'
import prisma from '@/prisma'
import createFile from '@/store/createFile'
import deleteFile from '@/store/deleteFile'
import type { UpdateOmbulSchemaType, UpdateOmbulFileSchemaType } from './schema'
import type { ExpandedOmbul } from './Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * Update an ombul
 * @param id - The id of the ombul to update
 * @param rawdata - The new data for the ombul including: name, year, issueNumber, description,
 * @returns The updated ombul
 */
export async function updateOmbul(
    id: number,
    rawdata: FormData | UpdateOmbulSchemaType
): Promise<ActionReturn<ExpandedOmbul>> {
    // auth route
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMBUL_UPDATE']
    })
    if (!authorized) {
        return createActionError(status)
    }

    const parse = updateOmbulSchema.safeParse(rawdata)
    if (!parse.success) {
        return createZodActionError(parse)
    }
    const data = parse.data

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
 * @param rawData - The new data for the new ombul file with field name 'file'
 * @returns The updated ombul
 */
export async function updateOmbulFile(
    id: number,
    rawData: FormData | UpdateOmbulFileSchemaType
): Promise<ActionReturn<ExpandedOmbul>> {
    // auth route
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMBUL_UPDATE']
    })
    if (!authorized) {
        return createActionError(status)
    }

    const parse = updateObuleFileSchema.safeParse(rawData)
    if (!parse.success) {
        return createZodActionError(parse)
    }
    const data = parse.data

    const ret = await createFile(data.ombulFile, 'ombul', ['pdf'])
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
        const delRet = await deleteFile('ombul', oldFsLocation)
        if (!delRet.success) return delRet

        return {
            success: true,
            data: ombulUpdated
        }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
