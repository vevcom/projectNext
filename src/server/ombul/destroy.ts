import 'server-only'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import { destroyFile } from '@/server/store/destroyFile'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedOmbul } from '@/server/ombul/Types'

/**
 * A function to destroy an ombul, also deletes the file from the store, and the cmsImage on cascade
 * @param id - The id of the ombul to destroy
 * @returns
 */
export async function destroyOmbul(id: number): Promise<ActionReturn<ExpandedOmbul>> {
    try {
        const ombul = await prisma.ombul.findUnique({
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
        })
        if (!ombul) {
            return createActionError('NOT FOUND', 'Ombul ikke funnet.')
        }

        const res = await destroyFile('ombul', ombul.fsLocation)
        if (!res.success) return res

        await prisma.ombul.delete({
            where: {
                id
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
