import { Permission } from '@prisma/client'
import type { PrismaClient } from '@prisma/client'

export default async function seedDevPermissions(prisma: PrismaClient) {
    const allPermissions = Object.values(Permission).map(permission => ({ permission }))

    // Seed default permissions
    await prisma.defaultPermission.createMany({
        data: allPermissions
    })

    // Create Harambe's role
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
}
