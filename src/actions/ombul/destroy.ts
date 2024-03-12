'use server'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import deleteFile from '@/store/deleteFile'
import { getUser } from '@/auth/user'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedOmbul } from './Types'

export async function destroyOmbul(id: number): Promise<ActionReturn<ExpandedOmbul>> {
    const { status, authorized } = await getUser({
        requiredPermissions: ['OMBUL_DESTROY']
    })

    if (!authorized) {
        return createActionError(status)
    }

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
        return createPrismaActionError(error)
    }
}
