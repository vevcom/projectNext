'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import deleteFile from '@/store/deleteFile'
import { requireUser } from '@/auth'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedOmbul } from './Types'

export async function destroyOmbul(id: number): Promise<ActionReturn<ExpandedOmbul>> {
    await requireUser({
        permissions: ['OMBUL_DESTROY']
    })

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
            return {
                success: false,
                error: [{
                    message: 'Ombul ikke funnet'
                }]
            }
        }

        const res = await deleteFile('ombul', ombul.fsLocation)
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
        return errorHandler(error)
    }
}
