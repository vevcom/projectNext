import 'server-only'
import { DotWrapperWithDotsIncluder } from './ConfigVars'
import { ServiceMethodHandler } from '@/services/ServiceMethodHandler'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import type { ReadPageInput } from '@/lib/paging/Types'
import type { DotCursor, DotDetails } from './Types'

/**
 * This method reads all dots for a user
 * @param userId - The user id to read dots for
 * @returns All dots for the user in ascending order of expiration. i.e the dot that expires first will be first in the list
 */
export const readForUser = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, { userId, onlyActive }: { userId: number, onlyActive: boolean }) => prisma.dot.findMany({
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
            const latestA = Math.max(...a.dots.map(dot => new Date(dot.expiresAt).getTime()))
            const latestB = Math.max(...b.dots.map(dot => new Date(dot.expiresAt).getTime()))
            return latestB - latestA
        }).map(wrapper => ({
            ...wrapper,
            dots: extendWithActive(wrapper.dots)
        }))
    }
})

export const readPage = ServiceMethodHandler({
    withData: false,
    handler: async (prisma, params: {
        paging: ReadPageInput<number, DotCursor, DotDetails>
    }) => (await prisma.dotWrapper.findMany({
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
    })).map(wrapper => ({
        ...wrapper,
        dots: extendWithActive(wrapper.dots)
    }))
})

function extendWithActive<T extends { expiresAt: Date }>(dots: T[]) {
    return dots.map(dot => ({
        ...dot,
        active: dot.expiresAt > new Date()
    }))
}
