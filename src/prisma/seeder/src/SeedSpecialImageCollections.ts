import { SpecialCollection } from '@prisma/client'
import type { PrismaClient, SpecialVisibilityPurpose } from '@prisma/client'

export const specialCollectionsVisibility = {
    OMBULCOVERS: {
        specialVisibility: 'OMBUL'
    },
    PROFILEIMAGES: {
        specialVisibility: 'USER'
    },
    STANDARDIMAGES: {
        specialVisibility: 'PUBLIC'
    },
    COMMITTEELOGOS: {
        specialVisibility: 'COMMITTEE'
    },
    FLAIRIMAGES: {
        specialVisibility: 'FLAIR'
    }
} satisfies {[CollectionType in SpecialCollection]: {
    specialVisibility: SpecialVisibilityPurpose
}}

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
