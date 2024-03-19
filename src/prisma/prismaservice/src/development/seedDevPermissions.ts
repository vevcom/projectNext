import { Permission } from '@/generated/pn'
import type { PrismaClient } from '@/generated/pn'

export default async function seedDevPermissions(prisma: PrismaClient) {
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

    const allPermissions = Object.values(Permission).map(permission => ({ permission }))

    await prisma.role.create({
        data: {
            name: `${user.firstname}s rolle`,
            permissions: {
                createMany: {
                    data: allPermissions
                }
            }
        },
    })
}
