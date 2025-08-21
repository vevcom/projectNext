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


    const allCommittess = await prisma.committee.findMany()

    for (const [shortName, permissions] of Object.entries(committeePermissions)) {
        checkForPermissionDuplicates(permissions, `${shortName} permissions`)

        const committee = allCommittess.find(c => c.shortName === shortName)
        if (!committee) {
            console.warn(`Committee with shortName ${shortName} not found, skipping permissions creation.`)
        }
    }

    for (const committee of allCommittess) {
        let permissions: Permission[] = committeePermissions[committee.shortName] ?? []
        permissions = permissions.concat(COMMITTEE_PERMISSIONS)
        permissions = permissions.filter((perm, index) => permissions.indexOf(perm) === index)

        await prisma.groupPermission.createMany({
            data: permissions.map(perm => ({
                permission: perm,
                groupId: committee.groupId
            }))
        })
    }
}

