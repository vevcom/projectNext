import 'server-only'
import { ServiceMethodHandler } from '../ServiceMethodHandler'

/**
 * This method reads all active dots for a user (not expired)
 * @param userId - The user id to read dots for
 * @returns All active dots for the user with the dot last to expire last
 */
export const readActive = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { userId }: { userId: number }) => {
        return prisma.dot.findMany({
            where: {
                wrapper: {
                    userId,
                },
                expiresAt: {
                    gt: new Date()
                },
            },
            orderBy: {
                expiresAt: 'asc'
            }
        })
    }
})