import type { PrismaClient } from '@/prisma-generated-pn-client'

export default async function seedDevGroups(prisma: PrismaClient) {
    const order = await prisma.omegaOrder.findFirst({
        orderBy: {
            order: 'desc'
        },
    })

    if (!order) {
        throw new Error('Failed to seed groups because no omega order exists')
    }

    await prisma.committee.create({
        data: {
            name: 'Harambe\'s komité',
            shortName: 'harcom',
            committeeArticle: {
                create: {
                    name: 'Harambe\'s komité',
                    coverImage: {
                        create: {
                            name: 'Harambe\'s bilde'
                        }
                    }
                }
            },
            paragraph: {
                create: {}
            },
            applicationParagraph: {
                create: {}
            },
            group: {
                create: {
                    groupType: 'COMMITTEE',
                    order: order.order,
                },
            },
            logoImage: {
                create: {
                    name: 'Logoen til Harambe\'s komité'
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
                            name: `Bilde for testkomité ${i}`
                        }
                    }
                }
            },
            paragraph: {
                create: {}
            },
            applicationParagraph: {
                create: {}
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
            articleSection: {
                create: {
                    cmsImage: { create: {} },
                    cmsParagraph: { create: {} },
                    cmsLink: { create: {} },
                }
            },
            group: {
                create: {
                    groupType: 'INTEREST_GROUP',
                    order: order.order,
                },
            },
        }
    })))
}
