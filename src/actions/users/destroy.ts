'use server'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'

export async function destroyUser(id: number): Promise<ActionReturn<User>> {
    try {
        const user = await prisma.user.delete({
            where: {
                id,
            },
        })

        if (!user) {
            return createActionError('NOT FOUND', 'Bruker ikke funnet.')
        }

        return { success: true, data: user }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

