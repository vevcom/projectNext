import { Permission } from '@/generated/pn'
import type { PrismaClient } from '@/generated/pn'

export default async function seedDevPermissions(prisma: PrismaClient) {
    const allPermissions = Object.values(Permission).map(permission => ({ permission }))

    // Create default role

    await prisma.role.upsert({
        where: {
            special: 'DEFAULT',
        },
        create: {
            name: `Standardrollen`,
            permissions: {
                createMany: {
                    data: allPermissions
                },
            },
        },
        update: {
            permissions: {
                createMany: {
                    data: allPermissions
                },
            },
        },
    })

    // Create Harambe's role

    const user = await prisma.user.findUnique({
        where: {
            username: 'Harambe104'
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

    // Only seed new role if one doesn't already exist
    const haramabeCommiteeRolesCount = await prisma.rolesGroups.count({
        where: {
            groupId: committee.groupId,
        },
    })

    if (haramabeCommiteeRolesCount > 0)
        return

    await prisma.role.create({
        data: {
            name: `${user.firstname}s rolle`,
            permissions: {
                createMany: {
                    data: allPermissions
                },
            },
            groups: {
                create: {
                    forAdminsOnly: false,
                    groupId: committee.groupId,
                },
            },
        },
    })
}
