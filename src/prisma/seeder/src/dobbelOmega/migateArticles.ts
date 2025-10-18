import { vevenIdToPnId } from './IdMapper'
import upsertOrderBasedOnDate from './upsertOrderBasedOnDate'
import type { PrismaClient as PrismaClientPn } from '@prisma/client'
import type { PrismaClient as PrismaClientVeven } from '@/prisma-dobbel-omega/client'
import type { IdMapper } from './IdMapper'
import type { Limits } from './migrationLimits'

/**
 * WARNING: This function is not complete, it does not migrate the InfoPages, only the articles (news)
 * WARNING: The text formatting is still bad, and needs to be fixed
 *
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
        const newArticleName = articlePn.name
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
                endDateTime: articlePn.endDateTime,
            }
        })
    }

    //TODO: Do it for infopages as well, many should probably be seeded and revritten though
    // Here is an overview of how the infopages should be migrated:
    //  * forside : not migrate, rewrite and add it to the seeder
    //  * for bedrifter: not migrate, already copied to the seeder
    //  * hytte: not migrate, rewrite and add it to the seeder
    //  * guider: Needs to be migrated
    //  * interesse grupper: Ingore, this is just junk
    //  * komiteer: The comitee page will migrate this
    //  * omagafond: Ignore
    //  * Om omega: Needs to be migrated
    //  * Jobbannonser: Ignore
    //
    // Never mind! Infopages er bare kaos. Det er tydeligvis to prikkreglementer, en viktig meling med et ødelagt bilde.
    // Dette tror jeg vi kopierer manuelt.
}
