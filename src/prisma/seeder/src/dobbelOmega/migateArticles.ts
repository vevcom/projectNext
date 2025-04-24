import { vevenIdToPnId } from './IdMapper'
import upsertOrderBasedOnDate from './upsertOrderBasedOnDate'
import type { PrismaClient as PrismaClientPn } from '@prisma/client'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { IdMapper } from './IdMapper'
import type { Limits } from './migrationLimits'

/**
 * WARNING: This function is not complete, it does not migrate the InfoPages, only the articles (news)
 * WARNING: The text formatting is still bad, and needs to be fixed
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
    const articles = await vevenPrisma.articles.findMany({ take: limits.articles ? limits.articles : undefined })

    const articlesPn = await Promise.all(articles.map(async (article, i) => {
        const coverId = vevenIdToPnId(imageIdMap, article.ImageId) || undefined


        const coverName = `${article.title.split(' ').join('_')}_cover${i}`
        const coverImage = await pnPrisma.cmsImage.upsert({
            where: {
                name: coverName,
            },
            update: {},
            create: {
                name: coverName,
                image: coverId ? {
                    connect: {
                        id: coverId,
                    },
                } : undefined,
            }
        })

        const articleSectionLead = await pnPrisma.articleSection.create({
            data: {
                name: `${article.title} lead ${i}`,
                cmsParagraph: {
                    create: {
                        contentHtml: article.lead || '',
                        createdAt: article.createdAt,
                        updatedAt: article.updatedAt,
                    }
                }
            }
        })
        const articleSectionBody = await pnPrisma.articleSection.create({
            data: {
                name: `${article.title} body ${i}`,
                cmsParagraph: {
                    create: {
                        contentHtml: article.text || '',
                        createdAt: article.createdAt,
                        updatedAt: article.updatedAt,
                    }
                }
            }
        })

        //TODO: link Article to a group (comitteee on veven)
        const articlePn = await pnPrisma.article.create({
            data: {
                name: article.title,
                createdAt: article.createdAt,
                updatedAt: article.updatedAt,
                coverImageId: coverImage.id,
                articleSections: {
                    connect: [
                        { id: articleSectionLead.id },
                        { id: articleSectionBody.id },
                    ]
                },
            }
        })

        const orderPublished = await upsertOrderBasedOnDate(pnPrisma, article.createdAt)

        return {
            ...articlePn,
            orderPublished,
            endDateTime: article.dateEnd || new Date(),
        }
    }))

    for (let i = 0; i < articles.length; i++) {
        const articlePn = articlesPn[i]
        let newArticleName = articlePn.name
        let unique = false

        let k = 0
        while (!unique) {
            const articlesSameWithNameAndOrder = await pnPrisma.newsArticle.findMany({
                where: {
                    articleName: newArticleName,
                    orderPublished: articlePn.orderPublished,
                }
            })

            if (articlesSameWithNameAndOrder.length) {
                console.log(`Must change a name of a article ${newArticleName} for unique constraint`)
                newArticleName = `${articlePn.name} (${++k})`
            } else {
                unique = true
            }
        }

        await pnPrisma.article.update({
            where: {
                id: articlePn.id,
            },
            data: {
                name: newArticleName,
            }
        })

        await pnPrisma.newsArticle.create({
            data: {
                article: {
                    connect: {
                        id: articlePn.id,
                    }
                },
                omegaOrder: {
                    connect: {
                        order: articlePn.orderPublished,
                    }
                },
                endDateTime: articlePn.endDateTime,
            }
        })
    }

    //TODO: Do it for infopages as well, many should probably be seeded and revritten though
}
