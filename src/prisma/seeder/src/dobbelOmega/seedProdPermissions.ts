import type { Permission, PrismaClient as PrismaClientPn } from '@prisma/client'


export default async function seedProdPermissions(prisma: PrismaClientPn) {
    const defaultPermissions: Permission[] = [
        'OMEGAQUOTES_WRITE',
        'OMEGAQUOTES_READ',
        'OMBUL_READ',
        'GROUP_READ',
        'CLASS_READ',
        'COMMITTEE_READ',
        'INTEREST_GROUP_READ',
        'STUDY_PROGRAMME_READ',
        'JOBAD_READ',
        'LOCKER_USE',
        'USERS_READ',
        'SCHOOLS_READ',
        'COURSES_READ',
        'EVENT_READ',
        'EVENT_REGISTRATION_READ',
        'EVENT_REGISTRATION_CREATE',
        'PURCHASE_CREATE',
        'CABIN_CALENDAR_READ',
        'CABIN_BOOKING_CABIN_CREATE',
        'CABIN_BOOKING_BED_CREATE'
    ]

    const permissionSet = new Set(defaultPermissions)
    if (permissionSet.size !== defaultPermissions.length) {
        const duplicates = defaultPermissions.filter((perm, index) => defaultPermissions.indexOf(perm) !== index)
        throw new Error(`A duplicate permission is trying to be added: ${duplicates.join(', ')}`)
    }

    await prisma.defaultPermission.createMany({
        data: defaultPermissions.map(perm => ({
            permission: perm
        }))
    })
}

