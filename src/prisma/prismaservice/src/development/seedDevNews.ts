import type { PrismaClient } from '../../generated/pn'

export default async function seedDevNews(prisma: PrismaClient) {
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

                            }
                        }
                    }
                },
                endDateTime: date,
                orderPublished: i,
            }
        })
    }
    // seed current news
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
                            create: {}
                        }
                    }
                },
                endDateTime: new Date(),
                orderPublished: i,
            }
        })
    }
}
