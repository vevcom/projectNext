import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'

/**
 * This function migrates articles from Veven to PN
 * @param pnPrisma - PrismaClientPn
 * @param vevenPrisma - PrismaClientVeven
 */
export default async function migrateArticles(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
) {
    const articles = await vevenPrisma.articles.findMany()

    await pnPrisma.article.createMany({
        data: articles.map(article => ({
            title: article.title,
            content: article.content,
            createdAt: article.createdAt,
            updatedAt: article.updatedAt,
            published: article.published,
            authorId: article.authorId,
        })),
    })
}