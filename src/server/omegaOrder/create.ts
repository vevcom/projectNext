import 'server-only'
import { readCurrentOmegaOrder } from './read'
import { AutomaticallyIncreaseOrder } from './ConfigVars'
import { GroupType, PrismaPromise } from '@prisma/client'
import { prismaCall } from '../prismaCall'
import prisma from '@/prisma'

/**
 * This function will increment omega, it creates a new order.
 * It will also automatically increment some grouptypes.
 * It is made sure that all groups are on current order or retired before incrementing.
 */
export async function createOmegaOrder() : Promise<void> {
    const { order: oldOrder } = await readCurrentOmegaOrder()

    //TODO: Check that all groups are on current (old) order or retired before incrementing
    const newOrder = oldOrder + 1

    const updatePromises = Object.values(GroupType).reduce((acc, type) => {
        if (!AutomaticallyIncreaseOrder[type]) return acc;
        acc.push(
            prisma.group.updateMany({
                where: {
                    order: oldOrder,
                    groupType: type
                    //TODO: Not retired
                },
                data: {
                    order: newOrder
                }
            })
        );
        return acc;
    }, [] as PrismaPromise<unknown>[])

    await prismaCall(() => prisma.$transaction([
        prisma.omegaOrder.create({
            data: {
                order: newOrder
            }
        }),
        ...updatePromises
    ]))
}