import type { PrismaClient } from '@prisma/client'

export default async function seedDevNews(prisma: PrismaClient) {
    // seed old news
    const date = new Date();
    date.setDate(date.getDate() - 365); // Subtract 365 days from the current date
    for (let i = 0; i < 60; i++) {
        await prisma.newsArticle.upsert({
            where: {
                articleName: `test_article_${i}`
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
            }
        })
    }
    // seed current news
    for (let i = 0; i < 10; i++) {
        await prisma.newsArticle.upsert({
            where: {
                articleName: `test_article_${i}`
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
            }
        })
    }
}