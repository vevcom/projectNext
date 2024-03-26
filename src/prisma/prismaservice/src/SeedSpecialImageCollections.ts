import { SpecialCollection } from '@/generated/pn'
import type { PrismaClient } from '@/generated/pn'

export const specialCollectionsVisibility = {
    OMBULCOVERS: {
        regularLevel: 'OMBUL_READ',
        adminLevel: 'OMBUL_CREATE'
    },
    STANDARDIMAGES: {
        regularLevel: null,
        adminLevel: 'CMS_ADMIN'
    },
    COMMITTEELOGOS: {
        regularLevel: 'COMMITTEE_READ',
        adminLevel: 'COMMITTEE_CREATE'
    },
    PROFILEIMAGES: {
        regularLevel: 'USER_READ',
        adminLevel: 'USER_CREATE'
    }
} as const

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
                    create: {
                        purpose: 'IMAGE',
                        published: true,
                        type: 'SPECIAL',
                        regularLevel: { create: {
                            permission: specialCollectionsVisibility[special].regularLevel
                        } },
                        adminLevel: { create: {
                            permission: specialCollectionsVisibility[special].adminLevel
                        } }
                    } //TODO: Link to special visibility with permission.
                }
            }
        })
    ))
}
