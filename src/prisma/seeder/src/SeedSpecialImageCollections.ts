import { SpecialCollection } from '@/prisma-generated-pn-types'
import type { PrismaClient } from '@/prisma-generated-pn-client'

export default async function SeedSpecialImageCollections(prisma: PrismaClient) {
    const keys = Object.keys(SpecialCollection) as SpecialCollection[]
    await Promise.all(keys.map(async (special) => {
        const visibilityAdmin = await prisma.visibility.create({ data: {} })
        const visibilityRead = await prisma.visibility.create({ data: {} })
        return await prisma.imageCollection.upsert({
            where: {
                name: special
            },
            update: {

            },
            create: {
                name: special,
                special,
                visibilityRead: { connect: { id: visibilityRead.id } },
                visibilityAdmin: { connect: { id: visibilityAdmin.id } }
            }
        })
    }))
}
