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
            active: true,
        },
    }

    await prisma.committee.create({
        data: {
            name: `${user.firstname}'s komité`,
            shortName: `${user.username.slice(0, 3)}com`,
            committeeArticle: {
                create: {
                    name:`${user.firstname}'s komité`,
                    coverImage: {
                        create: {
                            name: `${user.firstname}'s bilde`
                        }
                    }
                }
            },
            group: {
                create: {
                    groupType: 'COMMITTEE',
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
                    order: order.order,
                },
            },
        }
    })))

    await Promise.all([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => prisma.committee.create({
        data: {
            name: `Testkomité ${i}`,
            shortName: `TK${i}`,
            committeeArticle: {
                create: {
                    name: `Testkomité ${i}`,
                    coverImage: {
                        create: {
                            name: `Bilde til testkomité ${i}`
                        }
                    }
                }
            },
            group: {
                create: {
                    groupType: 'COMMITTEE',
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
                    order: order.order,
                },
            },
        }
    })))

    await Promise.all([1, 2, 3, 4, 5, 6].map(i => prisma.studyProgramme.create({
        data: {
            code: `COCO${i}`,
            name: `Studieprogram ${i}`,
            group: {
                create: {
                    groupType: 'STUDY_PROGRAMME',
                    order: order.order,
                },
            },
        }
    })))

    await prisma.studyProgramme.create({
        data: {
            name: 'Elektronisk Systemdesign og Innovasjon',
            code: 'MTEL',
            insititueCode: 'MTEL',
            yearsLength: 5,
            startYear: 2023,

            group: {
                create: {
                    groupType: 'STUDY_PROGRAMME',
                    memberships,
                    order: order.order,
                }
            }
        }
    })
}
