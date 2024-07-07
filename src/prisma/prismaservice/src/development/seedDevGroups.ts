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


    await prisma.studyProgramme.create({
        data: {
            name: "Elektronisk Systemdesign og Innovasjon",
            code: "MTEL",
            insititueCode: "MTEL",
            yearsLength: 5,
            startYear: 2023,

            group: {
                create: {
                    groupType: "STUDY_PROGRAMME",
                    membershipRenewal: true,
                    memberships
                }
            }
        }
    })
}
