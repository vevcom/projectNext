import { omegaOrderOperations } from '@/services/omegaOrder/operations'
import { defineSeedOperation } from '@/seeder/src/defineSeedOperation'
import type { PrismaClient } from '@/prisma-generated-pn-client'

const CURRENT_OMEGA_ORDER = 106

export const seedOrders = defineSeedOperation(async (prisma: PrismaClient) => {
    const omegaOrderCount = await prisma.omegaOrder.count()
    if (omegaOrderCount === 0) {
        await prisma.omegaOrder.create({ data: { order: 1 } })
    }

    let { order: currentOrder } = await omegaOrderOperations.readCurrent({})
    while (currentOrder < CURRENT_OMEGA_ORDER) {
        await omegaOrderOperations.create({})
        currentOrder++
    }
})
