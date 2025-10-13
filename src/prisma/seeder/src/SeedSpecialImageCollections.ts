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
    }
} satisfies {[CollectionType in SpecialCollection]: {
    specialVisibility: SpecialVisibilityPurpose
}}

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
                    connect: {
                        specialPurpose: specialCollectionsVisibility[special].specialVisibility
                    }
                }
            }
        })
    ))
}
