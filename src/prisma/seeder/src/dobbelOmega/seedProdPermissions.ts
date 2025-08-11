import { checkForPermissionDuplicates, COMMITTEE_PERMISSIONS } from '@/seeder/src/seedPermissions'
import { Permission } from '@prisma/client'
import type { PrismaClient as PrismaClientPn } from '@prisma/client'

export default async function seedProdPermissions(prisma: PrismaClientPn) {
    const allPermissions = Object.values(Permission)

    const committeePermissions: Record<string, Permission[]> = {
        vevcom: allPermissions,
        hs: allPermissions,
        ombul: [
            'OMBUL_READ',
            'OMBUL_CREATE',
            'OMBUL_UPDATE',
            'OMBUL_DESTROY',
        ],
        hyttecom: [
            'CABIN_ADMIN',
            'CABIN_BOOKING_ADMIN',
            'CABIN_PRODUCTS_ADMIN',
        ],
        contactor: [
            'DOTS_ADMIN',
            'SCREEN_READ',
            'SCREEN_ADMIN',
        ],
    }

    for (const [shortName, permissions] of Object.entries(committeePermissions)) {
        checkForPermissionDuplicates(permissions, `${shortName} permissions`)

        const committee = await prisma.committee.findUnique({
            where: {
                shortName,
            }
        })
        if (!committee) {
            console.warn(`Committee with shortName ${shortName} not found, skipping permissions creation.
This should never happen with no limits`)
            continue
        }

        await prisma.groupPermission.createMany({
            data: permissions.map(perm => ({
                permission: perm,
                groupId: committee.groupId
            }))
        })

        await prisma.groupPermission.createMany({
            data: COMMITTEE_PERMISSIONS.map(perm => ({
                permission: perm,
                groupId: committee.groupId,
            })),
            skipDuplicates: true,
        })
    }
}

