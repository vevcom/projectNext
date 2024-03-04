import { SpecialCollection } from '@prisma/client'
import type { PrismaClient } from '@prisma/client'

export default async function SeedSpecialImageCollections(prisma: PrismaClient) {
    let special: SpecialCollection
    for (special in SpecialCollection) {
        await prisma.imageCollection.upsert({
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
    }
}
