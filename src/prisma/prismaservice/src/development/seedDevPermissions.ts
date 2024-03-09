import { Permission } from '@prisma/client'
import type { PrismaClient } from '@prisma/client'

export default async function seedDevPermissions(prisma: PrismaClient) {
    const user = await prisma.user.findUnique({
        where: {
            username: 'Harambe104'
        }
    })

    if (!user) {
        throw Error('Failed to seed permissions because Harambe is dead')
    }

    const allPermissions = Object.values(Permission).map(permission => ({ permission }))

    await prisma.role.create({
        data: {
            name: `${user.firstname}s rolle`,
            users: {
                create: {
                    userId: user.id
                }
            },
            permissions: {
                createMany: {
                    data: allPermissions
                }
            }
        },
    })
}
