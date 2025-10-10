import '@pn-server-only'
import { dotAuthers } from './authers'
import { dotSchemas } from './schemas'
import { dotBaseDuration, dotsIncluder } from './constants'
import { defineOperation } from '@/services/serviceOperation'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { z } from 'zod'

/**
 * This method reads all dots for a user
 * @param userId - The user id to read dots for
 * @returns All dots for the user in ascending order of expiration. i.e the dot that expires first will be first in the list
 */
const readForUser = defineOperation({
    authorizer: ({ params }) => dotAuthers.readForUser.dynamicFields({ userId: params.userId }),
    paramsSchema: z.object({
        userId: z.number(),
        onlyActive: z.boolean(),
    }),
    operation: async ({ prisma, params: { userId, onlyActive } }) => prisma.dot.findMany({
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

const create = defineOperation({
    dataSchema: dotSchemas.create,
    authorizer: ({ data }) => dotAuthers.create.dynamicFields({ userId: data.userId }),
    paramsSchema: z.object({
        accuserId: z.number(),
    }),
    opensTransaction: true,
    operation: async ({ prisma, params, data: { value, ...data } }) => {
        const activeDots = await readForUser({
            params: { userId: data.userId, onlyActive: true }
        })

        const dotData : { expiresAt: Date }[] = []
        let prevExpiresAt = activeDots.length > 0 ? activeDots[activeDots.length - 1].expiresAt : new Date()
        for (let i = 0; i < value; i++) {
            //TODO: Take freezes into account
            const expiresAt = new Date(prevExpiresAt.getTime() + dotBaseDuration)
            dotData.push({ expiresAt })
            prevExpiresAt = expiresAt
        }
        await prisma.$transaction(async tx => {
            const wrapper = await tx.dotWrapper.create({
                data: {
                    ...data,
                    accuserId: params.accuserId
                }
            })
            await tx.dot.createMany({
                data: dotData.map(dd => ({
                    ...dd,
                    dotWrapperId: wrapper.id
                }))
            })
        })
    }
})

const readWrappersForUser = defineOperation({
    authorizer: ({ params }) => dotAuthers.readWrapperForUser.dynamicFields({ userId: params.userId }),
    paramsSchema: z.object({
        userId: z.number(),
    }),
    operation: async ({ prisma, params: { userId } }) => {
        const wrappers = await prisma.dotWrapper.findMany({
            where: {
                userId
            },
            include: dotsIncluder,
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

const readPage = defineOperation({
    authorizer: () => dotAuthers.readPage.dynamicFields({}),
    paramsSchema: readPageInputSchemaObject(
        z.number(),
        z.object({
            id: z.number(),
        }),
        z.object({
            userId: z.number().nullable(),
            onlyActive: z.boolean(),
        }),
    ),
    operation: async ({ prisma, params }) => (await prisma.dotWrapper.findMany({
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
        include: dotsIncluder,
    })).map(wrapper => ({
        ...wrapper,
        dots: extendWithActive(wrapper.dots)
    }))
})

export const dotOperations = {
    create,
    readForUser,
    readWrappersForUser,
    readPage,
} as const

function extendWithActive<T extends { expiresAt: Date }>(dots: T[]) {
    return dots.map(dot => ({
        ...dot,
        active: dot.expiresAt > new Date()
    }))
}
