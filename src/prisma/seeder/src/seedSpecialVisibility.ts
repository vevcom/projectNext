import type { Permission, SpecialVisibilityPurpose, PrismaClient } from '@prisma/client'

const SpecialVisibilityConfig = {
    OMBUL: {
        regularLevel: 'OMBUL_READ',
        adminLevel: 'OMBUL_CREATE'
    },
    PUBLIC: {
        regularLevel: null,
        adminLevel: 'FRONTPAGE_ADMIN' // just changed this to make ts happy
        // bypass and purposes will be removed
    },
    COMMITTEE: {
        regularLevel: 'COMMITTEE_READ',
        adminLevel: 'COMMITTEE_CREATE'
    },
    USER: {
        regularLevel: 'USERS_READ',
        adminLevel: 'USERS_CREATE'
    },
    FLAIR: {
        regularLevel: null,
        adminLevel: 'PERMISSION_FLAIR_EDIT',
    }
} satisfies { [VisibilityType in SpecialVisibilityPurpose]: {
    regularLevel: Permission | null,
    adminLevel: Permission | null
} }


export default async function SeedSpecialVisibility(prisma: PrismaClient) {
    const keys = Object.keys(SpecialVisibilityConfig) as SpecialVisibilityPurpose[]
    await Promise.all(keys.map(async (special) => {
        const visibilityAdmin = await prisma.visibility.create({ data: {} })
        const visibilityRead = await prisma.visibility.create({ data: {} })
        prisma.visibility.upsert({
            where: {
                specialPurpose: special
            },
            update: {

            },
            create: {
                specialPurpose: special,
                imageCollectionRead: { connect: { id: visibilityRead.id } },
                imageCollectionAdmin: { connect: { id: visibilityAdmin.id } }

            }
        })
    }
    ))
}
