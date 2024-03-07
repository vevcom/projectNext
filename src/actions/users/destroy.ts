'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
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
            return { success: false, error: [{ message: 'Bruker ikke funnet.' }] }
        }

        return { success: true, data: user }
    } catch (error) {
        return errorHandler(error)
    }
}

