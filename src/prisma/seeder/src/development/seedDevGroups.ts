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
            name: 'Harambes komité',
            shortName: 'harcom',
            committeeArticle: {
                create: {
                    name: 'Harambes komité',
                    coverImage: {
                        create: {
                            name: 'Harambes bilde'
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
                    ledgerAccounts: {
                        create: {
                            ledgerAccount: {
                                create: {
                                    type: 'GROUP',
                                    name: 'Kontoen til Harambes komité',
                                }
                            }
                        }
                    },
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
}
