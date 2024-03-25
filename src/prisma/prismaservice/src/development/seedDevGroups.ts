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

    // Only create haramebe's committee if it doesn't already exist
    const harambeMembershipCount = await prisma.membership.count({
        where: {
            userId: user.id,
        },
    })

    if (harambeMembershipCount > 0) return

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
                    membershipRenewal: false,
                    memberships,
                    order: order.order,
                },
            },
            logoImage: {
                create: {
                    name: `Logoen til ${user.firstname}'s komité`
                }
            },
        },
    })

    await Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => prisma.manualGroup.create({
        data: {
            name: `Testgruppe ${i}`,
            shortName: `TG${i}`,
            group: {
                create: {
                    groupType: 'MANUAL_GROUP',
                    membershipRenewal: true,
                    order: order.order,
                },
            },
        }
    })))

    await Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => prisma.committee.create({
        data: {
            name: `Testkomité ${i}`,
            shortName: `TK${i}`,
            group: {
                create: {
                    groupType: 'COMMITTEE',
                    membershipRenewal: true,
                    order: order.order,
                },
            },
            logoImage: {
                create: {
                    name: `Logoen til testkomité ${i}`
                }
            },
        }
    })))

    await Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => prisma.interestGroup.create({
        data: {
            name: `Interessegruppe ${i}`,
            shortName: `IG${i}`,
            group: {
                create: {
                    groupType: 'INTEREST_GROUP',
                    membershipRenewal: true,
                    order: order.order,
                },
            },
        }
    })))
}
