import { SpecialCollection } from '@prisma/client'
import type { PrismaClient } from '@prisma/client'

export default async function SeedSpecialImageCollections(prisma: PrismaClient) {
    const keys = Object.keys(SpecialCollection) as SpecialCollection[]
    await Promise.all(keys.map((special) =>
        prisma.imageCollection.upsert({
            where: {
                name: special
            },
            update: {

            },
            create: {
                name: special,
                special
            }
        })
    ))
}
