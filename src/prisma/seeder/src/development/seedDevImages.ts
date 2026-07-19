import { defineSeedOperation } from '@/seeder/src/defineSeedOperation'
import type { PrismaClient } from '@/prisma-generated-pn-client'

export const seedDevImages = defineSeedOperation(async (prisma: PrismaClient) => {
    await Promise.all(
        Array.from({ length: 10 }).map((_, index) => upsertTestImageCollection(prisma, index))
    )
})

async function upsertTestImageCollection(prisma: PrismaClient, index: number) {
    return prisma.imageCollection.upsert({
        where: {
            name: `test_collection_${index}`
        },
        update: {},
        create: {
            name: `test_collection_${index}`,
            description: 'just a test',
            visibilityAdmin: {
                create: {}
            },
            visibilityRegular: {
                create: {}
            }
        }
    })
}
