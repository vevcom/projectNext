import type { PrismaClient as PrismaClientPn } from '@/generated/pn'
import type { PrismaClient as PrismaClientVeven } from '@/generated/veven'
import type { IdMapper } from './IdMapper'
import { vevenIdToPnId } from './IdMapper'
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

    await Promise.all(articles.map(async (article, i) => {
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

        // The order is assumed to change 1. september, calculate by createdAt 
        // 1. september 1914 = order 1, 1. september 1915 = order 2, ...
        let orderPublished = new Date(article.createdAt).getFullYear() - 1914
        if (new Date(article.createdAt).getMonth() < 8) {
            orderPublished--
        }

        const news = await pnPrisma.newsArticle.create({
            data: {
                description: article.lead || '',
                endDateTime: article.dateEnd || new Date(),
                orderPublished,
                article: {
                    connect: {
                        id: articlePn.id,
                    },
                },
            }
        })
    }))
    //TODO: Do it for infopages as well, many should probably be seeded and revritten though
}