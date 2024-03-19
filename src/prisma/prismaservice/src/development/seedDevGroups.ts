import type { PrismaClient } from '@/generated/pn'

export default async function seedDevGroups(prisma: PrismaClient) {
    const user = await prisma.user.findUnique({
        where: {
            username: 'Harambe104'
        }
    })
    
    if (!user) {
        throw new Error('Failed to seed groups because Harambe is dead')
    }

    const order = await prisma.omegaOrder.findFirst({
        orderBy: {
            order: 'desc'
        },
    })

    if (!order) {
        throw new Error('Failed to seed groups because no omega order exists')
    }

    const memberships = {
        create: {
            user: {
                connect: {
                    id: user.id,
                },
            },
            omegaOrder: {
                connect: order
            },
            admin: true,
        },
    }

    await prisma.committee.create({
        data: {
            name: `${user.firstname}'s komité`,
            shortName: `${user.username.slice(0, 3)}com`,
            group: {
                create: {
                    groupType: 'COMMITTEE',
                    membershipRenewal: true,
                    memberships,
                },
            },
            logoImage: {
                create: {
                    name: `Logoen til ${user.firstname}'s komité`
                }
            },
        },
    })
}
