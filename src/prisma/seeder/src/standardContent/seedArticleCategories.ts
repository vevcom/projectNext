import { articleCategoryOperations } from '@/services/articleCategories/operations'
import { getImageForCmsImageRelation } from '@/seeder/src/seedImages'
import { defineSeedOperation } from '@/seeder/src/defineSeedOperation'
import { upsert } from '@/seeder/src/upsert'
import { fileURLToPath } from 'url'
import { join } from 'path'
import { readFileSync } from 'fs'
import type { ImagesAvailablieForCms } from '@/seeder/src/seedImages'
import type { PrismaClient } from '@/prisma-generated-pn-client'
import type { Data } from '@/services/serviceOperation'

const CMS_PARAGRAPHS_DIR = fileURLToPath(new URL('../../cms_paragraphs/', import.meta.url))

type SeedCmsImageConfig = { image: ImagesAvailablieForCms } &
    Required<Pick<Data<typeof articleCategoryOperations.updateArticle.coverImage>, 'imageSize'>>

type SeedCmsParagraphConfig = {
    file: string,
}

type SeedCmsLinkConfig =
    Required<Data<typeof articleCategoryOperations.updateArticle.articleSections.cmsLink>>

type SeedArticleSectionConfig = {
    cmsParagraph?: SeedCmsParagraphConfig,
    cmsImage?: SeedCmsImageConfig,
    cmsLink?: SeedCmsLinkConfig,
}

type SeedArticleConfig = Required<Data<typeof articleCategoryOperations.updateArticle.update>> & {
    coverImage: SeedCmsImageConfig,
    articleSections: SeedArticleSectionConfig[],
}

type SeedArticleCategoryConfig = Data<typeof articleCategoryOperations.create> & {
    articles: SeedArticleConfig[],
}

export const seedArticleCategoriesConfig = [
    {
        name: 'om omega',
        description: 'lær om omega',
        articles: [
            {
                name: 'om omega',
                coverImage: {
                    image: { dynamicImageSeededForCmsName: 'ohma' },
                    imageSize: 'LARGE'
                },
                articleSections: [
                    {
                        cmsParagraph: {
                            file: 'about/about_1.md'
                        },
                        cmsLink: {
                            url: 'https://omega.ntnu.no',
                            text: 'Til forsiden'
                        }
                    },
                    {
                        cmsParagraph: {
                            file: 'about/about_2.md'
                        },
                        cmsImage: {
                            image: { dynamicImageSeededForCmsName: 'kappemann' },
                            imageSize: 'LARGE'
                        }
                    }
                ]
            },
            {
                name: 'statutter',
                coverImage: {
                    image: { dynamicImageSeededForCmsName: 'ov' },
                    imageSize: 'MEDIUM'
                },
                articleSections: [
                    {
                        cmsParagraph: {
                            file: 'statutter/statutter_1.md'
                        },
                        cmsLink: {
                            url: 'https://omega.ntnu.no',
                            text: 'Til forsiden'
                        }
                    },
                    {
                        cmsParagraph: {
                            file: 'statutter/statutter_2.md'
                        },
                        cmsImage: {
                            image: { dynamicImageSeededForCmsName: 'traktat' },
                            imageSize: 'MEDIUM'
                        }
                    }
                ]
            },
        ]
    },
    {
        name: 'guider',
        description: 'få hjelp til ting',
        articles: [
            {
                name: 'prikkreglement',
                coverImage: {
                    image: { dynamicImageSeededForCmsName: 'ov' },
                    imageSize: 'MEDIUM'
                },
                articleSections: [
                    {
                        cmsParagraph: {
                            file: 'prikkreglement/prikkreglement_1.md'
                        },
                        cmsImage: {
                            image: { dynamicImageSeededForCmsName: 'traktat' },
                            imageSize: 'MEDIUM'
                        }
                    }
                ]
            },
            {
                name: 'søknadsguide',
                coverImage: {
                    image: { dynamicImageSeededForCmsName: 'ov' },
                    imageSize: 'MEDIUM'
                },
                articleSections: [
                    {
                        cmsParagraph: {
                            file: 'soknadsguide/soknadsguide_1.md'
                        },
                        cmsImage: {
                            image: { dynamicImageSeededForCmsName: 'kappemann' },
                            imageSize: 'MEDIUM'
                        }
                    }
                ]
            }
        ]
    }
] as const satisfies SeedArticleCategoryConfig[]

export const seedArticleCategories = defineSeedOperation(async (prisma) => {
    await Promise.all(seedArticleCategoriesConfig.map(async category => {
        const categoryResult = await upsert({
            checkExistance: () => articleCategoryOperations.read({ params: { name: category.name } }),
            create: () => articleCategoryOperations.create({
                data: { name: category.name, description: category.description }
            }),
            update: async () => {
                const existingCategory = await articleCategoryOperations.read({ params: { name: category.name } })
                return articleCategoryOperations.update({
                    params: { id: existingCategory.id },
                    data: { description: category.description }
                })
            },
        })

        await Promise.all(
            category.articles.map(article => upsertArticleInCategory(
                prisma,
                { id: categoryResult.id, name: category.name },
                article
            ))
        )
    }))
})

/**
 * Article creation has no dedicated bulk service operation (the article service is built for
 * incremental edit-mode updates), so existence is checked with a plain prisma read - there's no
 * service operation to look an article up by (category, name) - and, once confirmed missing, the
 * article is built entirely through service operations, the same way the admin CMS editor would.
 * On update nothing is touched - an admin may have since edited the article's content through the
 * CMS, so existing content is never reconciled with the seed config.
 */
async function upsertArticleInCategory(
    prisma: PrismaClient,
    articleCategory: { id: number, name: string },
    article: SeedArticleConfig
) {
    return upsert({
        checkExistance: () => prisma.article.findUnique({
            where: {
                articleCategoryId_name: { articleCategoryId: articleCategory.id, name: article.name }
            },
            select: { id: true }
        }),
        create: () => createArticleInCategory(prisma, articleCategory.id, article),
        update: () => Promise.resolve(),
    })
}

/**
 * Sections are added one at a time rather than with Promise.all: addSection reads the article's
 * current highest section order and writes order + 1, so adding two sections concurrently would
 * race on that read-then-write and can violate the (articleId, order) unique constraint.
 */
async function createArticleInCategory(
    prisma: PrismaClient,
    articleCategoryId: number,
    article: SeedArticleConfig
) {
    const createdArticle = await articleCategoryOperations.addArticleToCategory({
        params: { id: articleCategoryId }
    })

    await articleCategoryOperations.updateArticle.update({
        implementationParams: { articleCategoryId },
        params: { articleId: createdArticle.id },
        data: { name: article.name }
    })

    const coverImage = await getImageForCmsImageRelation(article.coverImage.image, prisma)
    await articleCategoryOperations.updateArticle.coverImage({
        implementationParams: { articleCategoryId },
        params: { cmsImageId: createdArticle.coverImage.id },
        data: { imageId: coverImage.id, imageSize: article.coverImage.imageSize }
    })

    for (const section of article.articleSections) {
        const updatedArticle = await articleCategoryOperations.updateArticle.addSection({
            implementationParams: { articleCategoryId },
            params: { articleId: createdArticle.id },
            data: {
                includeParts: {
                    cmsParagraph: Boolean(section.cmsParagraph),
                    cmsImage: Boolean(section.cmsImage),
                    cmsLink: Boolean(section.cmsLink),
                }
            }
        })

        // We need to know the ids of the parts of the newest section.
        // The newest section is the one with the highest order.
        const newSection = updatedArticle.articleSections.reduce(
            (highestOrderSection, candidateSection) => (
                candidateSection.order > highestOrderSection.order ? candidateSection : highestOrderSection
            )
        )

        if (section.cmsParagraph && newSection.cmsParagraph) {
            await articleCategoryOperations.updateArticle.articleSections.cmsParagraph({
                implementationParams: { articleCategoryId },
                params: { paragraphId: newSection.cmsParagraph.id },
                data: {
                    markdown: readFileSync(join(CMS_PARAGRAPHS_DIR, section.cmsParagraph.file), 'utf-8')
                }
            })
        }

        if (section.cmsImage && newSection.cmsImage) {
            const sectionImage = await getImageForCmsImageRelation(section.cmsImage.image, prisma)
            await articleCategoryOperations.updateArticle.articleSections.cmsImage({
                implementationParams: { articleCategoryId },
                params: { cmsImageId: newSection.cmsImage.id },
                data: { imageId: sectionImage.id, imageSize: section.cmsImage.imageSize }
            })
        }

        if (section.cmsLink && newSection.cmsLink) {
            await articleCategoryOperations.updateArticle.articleSections.cmsLink({
                implementationParams: { articleCategoryId },
                params: { linkId: newSection.cmsLink.id },
                data: { url: section.cmsLink.url }
            })
        }
    }

    return createdArticle
}
