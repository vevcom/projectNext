import prisma from '@/prisma'
import { beforeAll } from '@jest/globals'

beforeAll(async () => {
    // _______ ______ __  __ _____
    //|__   __|  ____|  \/  |  __ \
    //   | |  | |__  | \  / | |__) |
    //   | |  |  __| | |\/| |  ___/
    //   | |  | |____| |  | | |
    //   |_|  |______|_|  |_|_|

    // TODO: Refactor to make it reusable, maybe share functionality with seeding?
    await prisma.omegaOrder.create({
        data: {
            order: 104,
        },
    })
})
