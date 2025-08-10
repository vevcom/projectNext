import { Permission } from '@prisma/client'
import type { OmegaMembershipLevel, PrismaClient as PrismaClientPn } from '@prisma/client'

function checkForPuplicates(arr: Permission[], failMessage: string) {
    const permissionSet = new Set(arr)
    if (permissionSet.size !== arr.length) {
        const duplicates = arr.filter((perm, index) => arr.indexOf(perm) !== index)
        throw new Error(
            `A duplicate permission is trying to be added to ${failMessage}, duplicates: ${duplicates.join(', ')}`
        )
    }
}

export default async function seedProdPermissions(prisma: PrismaClientPn) {
    const defaultPermissions: Permission[] = [
        'GROUP_READ',
        'CLASS_READ',
        'JOBAD_READ',
        'SCHOOLS_READ',
        'COURSES_READ',
        'CABIN_CALENDAR_READ',
        'CABIN_BOOKING_CABIN_CREATE',
        'CABIN_BOOKING_BED_CREATE'
    ]

    checkForPuplicates(defaultPermissions, 'default permissions')

    await prisma.defaultPermission.createMany({
        data: defaultPermissions.map(perm => ({
            permission: perm
        }))
    })

    const membershipPermissions: Record<OmegaMembershipLevel, Permission[]> = {
        MEMBER: [
            'OMBUL_READ',
            'OMEGAQUOTES_READ',
            'OMEGAQUOTES_WRITE',
            'COMMITTEE_READ',
            'INTEREST_GROUP_READ',
            'STUDY_PROGRAMME_READ',
            'LOCKER_USE',
            'EVENT_READ',
            'EVENT_REGISTRATION_READ',
            'EVENT_REGISTRATION_CREATE',
            'PURCHASE_CREATE',
            'USERS_READ',
        ],
        SOELLE: [
            'OMBUL_READ',
            'OMEGAQUOTES_READ',
            'COMMITTEE_READ',
            'INTEREST_GROUP_READ',
            'STUDY_PROGRAMME_READ',
            'EVENT_READ',
            'EVENT_REGISTRATION_READ',
            'USERS_READ',
        ],
        EXTERNAL: []
    }

    checkForPuplicates(membershipPermissions.MEMBER, 'MEMBER permissions')
    checkForPuplicates(membershipPermissions.SOELLE, 'SOELLE permissions')
    checkForPuplicates(membershipPermissions.EXTERNAL, 'EXTERNAL permissions')

    for (const [level, permissions] of Object.entries(membershipPermissions)) {
        const group = await prisma.omegaMembershipGroup.findUniqueOrThrow({
            where: {
                omegaMembershipLevel: level as OmegaMembershipLevel,
            }
        })

        await prisma.groupPermission.createMany({
            data: permissions.map(perm => ({
                permission: perm,
                groupId: group.id
            }))
        })
    }

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
        ],
    }

    for (const [shortName, permissions] of Object.entries(committeePermissions)) {
        checkForPuplicates(permissions, `${shortName} permissions`)

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
    }
}

