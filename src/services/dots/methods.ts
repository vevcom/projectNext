import '@pn-server-only'
import { DotConfig } from './config'
import { DotAuthers } from './authers'
import { DotSchemas } from './schemas'
import { ServiceMethod } from '@/services/ServiceMethod'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { readPageInputSchemaObject } from '@/lib/paging/schema'
import { z } from 'zod'

/**
 * This method reads all dots for a user
 * @param userId - The user id to read dots for
 * @returns All dots for the user in ascending order of expiration. i.e the dot that expires first will be first in the list
 */
const readForUser = ServiceMethod({
    auther: ({ params }) => DotAuthers.readForUser.dynamicFields({ userId: params.userId }),
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

const create = ServiceMethod({
    dataSchema: DotSchemas.create,
    auther: ({ data }) => DotAuthers.create.dynamicFields({ userId: data.userId }),
    paramsSchema: z.object({
        accuserId: z.number(),
    }),
    opensTransaction: true,
    method: async ({ prisma, params, data: { value, ...data }, session }) => {
        const activeDots = await readForUser.client(prisma).execute({
            params: { userId: data.userId, onlyActive: true },
            session,
        })

        const dotData : { expiresAt: Date }[] = []
        let prevExpiresAt = activeDots.length > 0 ? activeDots[activeDots.length - 1].expiresAt : new Date()
        for (let i = 0; i < value; i++) {
            //TODO: Take freezes into account
            const expiresAt = new Date(prevExpiresAt.getTime() + DotConfig.baseDuration)
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

const readWrappersForUser = ServiceMethod({
    auther: ({ params }) => DotAuthers.readWrapperForUser.dynamicFields({ userId: params.userId }),
    paramsSchema: z.object({
        userId: z.number(),
    }),
    method: async ({ prisma, params: { userId } }) => {
        const wrappers = await prisma.dotWrapper.findMany({
            where: {
                userId
            },
            include: DotConfig.wrapperWithDotsIncluder,
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

const readPage = ServiceMethod({
    auther: () => DotAuthers.readPage.dynamicFields({}),
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
        include: DotConfig.wrapperWithDotsIncluder,
    })).map(wrapper => ({
        ...wrapper,
        dots: extendWithActive(wrapper.dots)
    }))
})

export const dotMethods = {
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
