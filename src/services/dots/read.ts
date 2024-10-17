import 'server-only'
import { ServiceMethodHandler } from '../ServiceMethodHandler'
import { ReadPageInput } from '../paging/Types'
import { DotCursor, DotDetails } from './Types'
import { cursorPageingSelection } from '../paging/cursorPageingSelection'
import { DotWrapperWithDotsIncluder } from './ConfigVars'

/**
 * This method reads all dots for a user
 * @param userId - The user id to read dots for
 * @returns All dots for the user in ascending order of expiration. i.e the dot that expires first will be first in the list
 */
export const readForUser = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { userId, onlyActive }: { userId: number, onlyActive: boolean }) => {
        return prisma.dot.findMany({
            where: {
                wrapper: {
                    userId,
                },
                expiresAt: onlyActive ? {
                    gt: new Date()
                } : undefined,
            },
            orderBy: {
                expiresAt: 'asc'
            }
        })
    }
})

export const readWrappersForUser = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { userId }: { userId: number }) => {
        const wrappers = await prisma.dotWrapper.findMany({
            where: {
                userId
            },
            include: DotWrapperWithDotsIncluder,
        })

        return wrappers.sort((a, b) => {
            const latestA = Math.max(...a.dots.map(dot => new Date(dot.expiresAt).getTime()));
            const latestB = Math.max(...b.dots.map(dot => new Date(dot.expiresAt).getTime()));
            return latestB - latestA;
        });
    }
})

export const readPage = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: { paging: ReadPageInput<number, DotCursor, DotDetails> }) => {
        return await prisma.dotWrapper.findMany({
            ...cursorPageingSelection(params.paging.page),
            where: {
                userId: params.paging.details.userId ?? undefined,
                dots: params.paging.details.onlyActive ? {
                    some: {
                        expiresAt: {
                            gt: new Date()
                        }
                    }
                } : undefined
            },
            orderBy: {
                user: {
                    username: 'asc'
                }
            },
            include: DotWrapperWithDotsIncluder,
        })
    }
})