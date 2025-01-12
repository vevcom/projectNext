import 'server-only'
import { DotWrapperWithDotsIncluder } from './ConfigVars'
import { readDotAuther, readDotForUserAuther } from './authers'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { ServiceMethod } from '@/services/ServiceMethod'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { z } from 'zod'

/**
 * This method reads all dots for a user
 * @param userId - The user id to read dots for
 * @returns All dots for the user in ascending order of expiration. i.e the dot that expires first will be first in the list
 */
export const readDotsForUser = ServiceMethod({
    auther: readDotForUserAuther,
    dynamicAuthFields: ({ params }) => ({ userId: params.userId }),
    paramsSchema: z.object({
        userId: z.number(),
        onlyActive: z.boolean(),
    }),
    method: async ({ prisma, params: { userId, onlyActive } }) => prisma.dot.findMany({
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

export const readDotWrappersForUser = ServiceMethod({
    auther: readDotForUserAuther,
    dynamicAuthFields: ({ params }) => ({ userId: params.userId }),
    paramsSchema: z.object({
        userId: z.number(),
    }),
    method: async ({ prisma, params: { userId } }) => {
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

export const readDotsPage = ServiceMethod({
    auther: readDotAuther,
    dynamicAuthFields: () => ({}),
    paramsSchema: readPageInputSchemaObject(
        z.number(),
        z.object({
            id: z.number(),
        }),
        z.object({
            userId: z.number().nullable(),
            onlyActive: z.boolean(),
        }),
    ), // Created from ReadPageInput<number, DotCursor, DotDetails> TODO: Maybe refactor to be more reusable?
    method: async ({ prisma, params }) => (await prisma.dotWrapper.findMany({
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
