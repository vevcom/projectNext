import '@pn-server-only'
import { prismaCall } from '@/services/prismaCall'
import { ServerError } from '@/services/error'
import { prisma } from '@/prisma/client'
import { destroyFile } from '@/services/store/destroyFile'
import type { ExpandedOmbul } from '@/services/ombul/types'

/**
 * A function to destroy an ombul, also deletes the file from the store, and the cmsImage on cascade
 * @param id - The id of the ombul to destroy
 * @returns
 */
export async function destroyOmbul(id: number): Promise<ExpandedOmbul> {
    const ombul = await prismaCall(() => prisma.ombul.findUnique({
        where: {
            id
        },
        include: {
            coverImage: {
                include: {
                    image: true
                }
            }
        }
    }))
    if (!ombul) throw new ServerError('NOT FOUND', 'Ombul ikke funnet.')

    await destroyFile('ombul', ombul.fsLocation)

    await prisma.ombul.delete({
        where: {
            id
        }
    })

    return ombul
}
