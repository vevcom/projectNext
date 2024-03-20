import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'

/**
 * Invalidate a given user.
 * This must be done after modifying data that is stored in the JWT.
 * The *only* exception is modifying data that is on the user model
 * as this is done it automatically.
 * 
 * @param userIds - The id of the user.
 */
export async function invalidateOneUserSessionData(userId: number): Promise<void> {
    await prismaCall(() => prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            // The JWT is invalid if it was created after the user model was updated
            updatedAt: new Date(), 
        }
    }))
}

/**
 * Invalidate all JWTs for given users.
 * This must be done after modifying data that is stored in the JWT.
 * The *only* exception is modifying data that is on the user model
 * as this is done it automatically.
 * 
 * @param userIds - The ids of the users.
 */
export async function invalidateManyUserSessionData(userIds: number[]): Promise<void> {
    await Promise.all(userIds.map(userId => invalidateOneUserSessionData(userId)))
}
