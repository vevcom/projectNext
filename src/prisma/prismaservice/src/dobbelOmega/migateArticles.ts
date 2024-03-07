import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { IdMapper } from './IdMapper'
import { vevenIdToPnId } from './IdMapper'
import type { Limits } from './migrationLimits'

/**
 * This function migrates articles from Veven to PN, 
 * Both Articles -> NewsAricle (with Article relation)
 * And InfoPages -> Articles (belonging to a Article collection)
 * @param pnPrisma - PrismaClientPn
 * @param vevenPrisma - PrismaClientVeven
 * @param imageIdMap - IdMapper - A map of the old and new id's of the images to get cover images
 * @param limits - Limits - used to limit the number of articles to migrate
 */
export default async function migrateArticles(
    pnPrisma: PrismaClientPn,
    vevenPrisma: PrismaClientVeven,
    imageIdMap: IdMapper,
    limits: Limits,
) {
    const articles = await vevenPrisma.articles.findMany()

    const articlesWithLimit = limits.articles ? articles.splice(0, limits.articles) : articles

    await Promise.all(articlesWithLimit.map(async (article, i) => {
        const coverId = vevenIdToPnId(imageIdMap, article.ImageId) || undefined

        const coverImage = await pnPrisma.cmsImage.upsert({
            where: {
                name: `${article.title.split(' ').join('_')}_cover${i}`,
            },
            update: {},
            create: {
                name: article.title,
                image: coverId ? {
                    connect: {
                        id: coverId,
                    },
                } : undefined,
            }
        })

        const cmsParagraph = await pnPrisma.cmsParagraph.create({
            data: {
                content: article.content,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
            }
        })

        //TODO: link Article to a group (comitteee on veven)
        const articlePn = await pnPrisma.article.createMany({
            data: articles.map(article => ({
                name: article.title,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
                coverImageId: coverImage.id,
            })),
        })
    }))
    //TODO: Do it for infopages as well, many should probably be seeded and revritten though
}