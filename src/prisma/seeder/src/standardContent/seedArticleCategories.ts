import { articleCategoryOperations } from '@/services/articleCategories/operations'
import type { PrismaClient } from '@/prisma-generated-pn-client'
import { upsert } from './upsert'

export const seedArticleCategoriesConfig = [
    {
        name: 'om omega',
        description: 'lær om omega',
        articles: [
            {
                name: 'om omega',
                coverImage: {
                    name: 'about_cover',
                    imageName: 'ohma',
                    imageSize: 'LARGE'
                },
                articleSections: [
                    {
                        name: 'about_1',
                        cmsParagraph: {
                            name: 'about_1_paragraph',
                            file: 'about/about_1.md'
                        },
                        cmsLink: {
                            name: 'about_1_link',
                            url: 'https://omega.ntnu.no',
                        }
                    },
                    {
                        name: 'about_2',
                        cmsParagraph: {
                            name: 'about_2_paragraph',
                            file: 'about/about_2.md'
                        },
                        cmsImage: {
                            name: 'about_2_image',
                            imageName: 'kappemann',
                            imageSize: 'LARGE'
                        }
                    }
                ]
            },
            {
                name: 'statutter',
                coverImage: {
                    name: 'statutter_cover',
                    imageName: 'ov',
                    imageSize: 'MEDIUM'
                },
                articleSections: [
                    {
                        name: 'statutter_1',
                        cmsParagraph: {
                            name: 'statutter_1_paragraph',
                            file: 'statutter/statutter_1.md'
                        },
                        cmsLink: {
                            name: 'statutter_1_link',
                            url: 'https://omega.ntnu.no',
                        }
                    },
                    {
                        name: 'statutter_2',
                        cmsParagraph: {
                            name: 'statutter_2_paragraph',
                            file: 'statutter/statutter_2.md'
                        },
                        cmsImage: {
                            name: 'statutter_2_image',
                            imageName: 'traktat',
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
                    name: 'prikkreglement_cover',
                    imageName: 'ov',
                    imageSize: 'MEDIUM'
                },
                articleSections: [
                    {
                        name: 'prikkreglement_1',
                        cmsParagraph: {
                            name: 'prikkreglement_1_paragraph',
                            file: 'prikkreglement/prikkreglement_1.md'
                        },
                        cmsImage: {
                            name: 'prikkreglement_1_image',
                            imageName: 'traktat',
                            imageSize: 'MEDIUM'
                        }
                    }
                ]
            },
            {
                name: 'søknadsguide',
                coverImage: {
                    name: 'søknadsguide_cover',
                    imageName: 'ov',
                    imageSize: 'MEDIUM'
                },
                articleSections: [
                    {
                        name: 'søknadsguide_1',
                        cmsParagraph: {
                            name: 'søknadsguide_1_paragraph',
                            file: 'soknadsguide/soknadsguide_1.md'
                        },
                        cmsImage: {
                            name: 'søknadsguide_1_image',
                            imageName: 'kappemann',
                            imageSize: 'MEDIUM'
                        }
                    }
                ]
            }
        ]
    }
] as const satisfies { name: string, description: string }[]

export async function upsertArticleCategories() {
    await seedArticleCategoriesConfig.forEach(
        async (category) => {
            await upsert({
                checkExistance: () => articleCategoryOperations.read(
                    { params: { name: category.name } }
                ) !== null,
                create: async () => articleCategoryOperations.create({

                }),
                update: async () => {}
            })
    )
}
