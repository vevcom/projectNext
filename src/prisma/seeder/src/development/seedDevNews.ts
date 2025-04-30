import type { PrismaClient } from '@prisma/client'

export default async function seedDevNews(prisma: PrismaClient) {
    const order = await prisma.omegaOrder.findFirst()
    if (!order) throw new Error('No omega order found to seed news to')

    const image = await prisma.image.findUniqueOrThrow({
        where: {
            special: 'REALFAGSBYGGET',
        }
    })

    // seed old news
    const date = new Date()
    date.setDate(date.getDate() - 365) // Subtract 365 days from the current date
    for (let i = 2000; i < 2060; i++) {
        await prisma.newsArticle.upsert({
            where: {
                id: i,
            },
            update: {

            },
            create: {
                description: 'hei gå til helvete',
                article: {
                    create: {
                        name: `test_article_${i}`,
                        coverImage: {
                            create: {
                                image: {
                                    connect: {
                                        id: image.id
                                    }
                                }
                            }
                        }
                    }
                },
                endDateTime: date,
                omegaOrder: {
                    connect: order,
                },
            }
        })
    }
    // seed current news
    const activeDate = new Date()
    activeDate.setDate(activeDate.getDate() + 7)
    for (let i = 2060; i < 2070; i++) {
        await prisma.newsArticle.upsert({
            where: {
                id: i,
            },
            update: {

            },
            create: {
                description: 'hei gå til helvete',
                article: {
                    create: {
                        name: `test_article_${i}`,
                        coverImage: {
                            create: {
                                image: {
                                    connect: {
                                        id: image.id
                                    }
                                }
                            }
                        }
                    }
                },
                endDateTime: activeDate,
                omegaOrder: {
                    connect: order,
                }
            }
        })
    }
}
