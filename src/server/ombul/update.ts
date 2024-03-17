import 'server-only'
import { ServerError } from '@/server/error'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import { createFile } from '@/server/store/createFile'
import { destroyFile } from '@/server/store/destroyFile'
import type { Prisma } from '@prisma/client'
import type { ExpandedOmbul } from './Types'

/**
 * A function Update an ombul
 * @param id - The id of the ombul to update
 * @param data - The new data for the ombul including: name, year, issueNumber, description. ....
 * @returns The updated ombul
 */
export async function updateOmbul(
    id: number,
    data: Prisma.OmbulUpdateInput
): Promise<ExpandedOmbul> {
    return await prismaCall(() => prisma.ombul.update({
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
    }))
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
): Promise<ExpandedOmbul> {
    const ret = await createFile(file, 'ombul', ['pdf'])
    const fsLocation = ret.fsLocation

    const ombul = await prisma.ombul.findUnique({
        where: {
            id
        }
    })
    if (!ombul) throw new ServerError('NOT FOUND', 'Ombul ikke funnet')

    const oldFsLocation = ombul.fsLocation

    const ombulUpdated = await prismaCall(() => prisma.ombul.update({
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
    }))

    //delete the old file
    await destroyFile('ombul', oldFsLocation)

    return ombulUpdated
}
