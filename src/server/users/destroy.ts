import 'server-only'
import { createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/Types'
import type { User } from '@prisma/client'

/**
 * Action to destroy a user by the given id
 * @param id - The id of the user to destroy
 * @returns
 */
export async function destroyUser(id: number): Promise<ActionReturn<User>> {
    try {
        const user = await prisma.user.delete({
            where: {
                id,
            },
        })

        return { success: true, data: user }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
