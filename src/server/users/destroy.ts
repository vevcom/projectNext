import 'server-only'
import prisma from '@/prisma'
import type { User } from '@prisma/client'
import { prismaCall } from '../prismaCall'

/**
 * Action to destroy a user by the given id
 * @param id - The id of the user to destroy
 * @returns
 */
export async function destroyUser(id: number): Promise<User> {
    return await prismaCall(() => prisma.user.delete({
        where: {
            id,
        },
    }))
}
