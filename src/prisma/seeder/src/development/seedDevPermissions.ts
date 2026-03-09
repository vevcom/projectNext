import { COMMITTEE_PERMISSIONS } from '@/seeder/src/seedPermissions'
import { Permission } from '@/prisma-generated-pn-types'
import type { PrismaClient } from '@/prisma-generated-pn-client'

export default async function seedDevPermissions(prisma: PrismaClient) {
    const allPermissions = Object.values(Permission).map(permission => ({ permission }))

    const user = await prisma.user.findUnique({
        where: {
            username: 'harambe'
        }
    })

    if (!user) {
        throw new Error('Failed to seed permissions because Harambe is dead')
    }

    const committee = await prisma.committee.findFirst({
        where: {
            group: {
                memberships: {
                    some: {
                        user,
                    }
                }
            }
        }
    })

    if (!committee) {
        throw new Error('Failed to seed permissions becasue Harambe\'s committee is dead')
    }

    await prisma.groupPermission.createMany({
        data: allPermissions.map(permission => ({
            permission: permission.permission,
            groupId: committee.groupId
        }))
    })

    const allCommittees = await prisma.committee.findMany()

    await Promise.all(allCommittees.map(com =>
        prisma.groupPermission.createMany({
            data: COMMITTEE_PERMISSIONS.map(perm => ({
                permission: perm,
                groupId: com.groupId,
            })),
            skipDuplicates: true,
        })
    ))
}
