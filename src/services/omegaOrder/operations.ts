import '@pn-server-only'
import { omegaOrderAuth } from './auth'
import { AutomaticallyIncreaseOrder } from './constants'
import { defineOperation } from '@/services/serviceOperation'
import { ServerError } from '@/services/error'
import { GroupType } from '@/prisma-generated-pn/client'
import type { PrismaPromise } from '@prisma/client/runtime/client'

export const omegaOrderOperations = {
    /**
     * This function will increment omega; it creates a new order.
     * It will also automatically increment the order of some grouptypes.
     * The group types not automatically incremented,
     * it is made sure that all (non retired) groups are on current order before incrementing.
     */
    create: defineOperation({
        opensTransaction: true,
        authorizer: () => omegaOrderAuth.create.dynamicFields({}),
        operation: async ({ prisma }) => {
            const { order: oldOrder } = await omegaOrderOperations.readCurrent({ bypassAuth: true })

            //TODO: Check that all groups are on current (old) order or retired before incrementing
            const newOrder = oldOrder + 1
            const updatePromises = Object.values(GroupType).reduce((acc, type) => {
                if (!AutomaticallyIncreaseOrder[type]) return acc
                acc.push(
                    prisma.group.updateMany({
                        where: {
                            order: {
                                lt: newOrder
                            },
                            groupType: type
                            //TODO: Not retired
                        },
                        data: {
                            order: newOrder
                        }
                    })
                )
                return acc
            }, [] as PrismaPromise<unknown>[])

            await prisma.$transaction([
                prisma.omegaOrder.create({
                    data: {
                        order: newOrder
                    }
                }),
                ...updatePromises
            ])
        }
    }),
    readCurrent: defineOperation({
        authorizer: () => omegaOrderAuth.readCurrent.dynamicFields({}),
        operation: async ({ prisma }) => {
            const omegaOrder = await prisma.omegaOrder.findFirst({
                orderBy: {
                    order: 'desc'
                }
            })
            if (!omegaOrder) throw new ServerError('NOT FOUND', 'Current Omega Order not found')
            return omegaOrder
        }
    }),
    readAll: defineOperation({
        authorizer: () => omegaOrderAuth.readAll.dynamicFields({}),
        operation: async ({ prisma }) =>
            await prisma.omegaOrder.findMany({
                orderBy: {
                    order: 'desc'
                }
            })
    }),
} as const
