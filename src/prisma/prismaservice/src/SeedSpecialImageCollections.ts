import { SpecialCollection } from '@/generated/pn'
import type { PrismaClient } from '@/generated/pn'

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
                special,
                visibility: {
                    create: {} //TODO: Link to special visibility with permission.
                }
            }
        })
    ))
}
