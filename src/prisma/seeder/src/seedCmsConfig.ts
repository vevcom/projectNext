import type {
    Position,
    ImageSize,
    SpecialCmsImage,
    SpecialCmsParagraph,
    SpecialCmsArticle,
} from '@/prisma-generated-pn-types'
import type { ImagesAvailablieForCms } from './seedImages'

export type SeedCmsImage = {
    name: string,
    image: ImagesAvailablieForCms,
    imageSize?: ImageSize
}

export type SeedCmsParagraph = {
    name: string,
    file: string
}

export type SeedCmsLink = {
    name: string,
    url: string
}

export type SeedArticleSection = {
    name: string,
    cmsImage?: SeedCmsImage,
    cmsParagraph?: SeedCmsParagraph,
    cmsLink?: SeedCmsLink
    imagePosition?: Position
    imageSize?: number,
}

export const standardArticleCategories = [
    {
        name: 'om omega',
        description: 'lær om omega',
    },
    {
        name: 'guider',
        description: 'få hjelp til ting',
    }
] as const

export type SeedCategories = typeof standardArticleCategories[number]
type Categories = typeof standardArticleCategories[number]['name']

export type SeedArticle = {
    name: string,
    coverImage: SeedCmsImage,
    articleSections: SeedArticleSection[],
} & ({
    category: Categories
} | {
    category: 'news',
    description: string,
    orderPublished: number
} | { category: 'special' })


type SpecialCmsImageSeederConfig  = {
    [T in SpecialCmsImage]: SeedCmsImage;
}

/**
 * This object describes the wanted initial configuration of special cms images.
 * Note of course that this is no guarantee the special cms image will contain this image forevever
 * but it creates an initial state (i.e. image relation) that is nice for development.
 *
 * Strictly speaking it is not neccesarry to seed any special cms image, as the cms image api will
 * create the special cms image on runtime if it does not exist - but with a null image relation.
 */
export const seedSpecialCmsImageConfig: SpecialCmsImageSeederConfig = {
    FRONTPAGE_1: {
        name: 'frontpage_1',
        image: {
            dynamicImageSeededForCmsName: 'kappemann'
        }
    },
    FRONTPAGE_2: {
        name: 'frontpage_2',
        image: {
            dynamicImageSeededForCmsName: 'ohma'
        }
    },
    FRONTPAGE_3: {
        name: 'frontpage_3',
        image: {
            dynamicImageSeededForCmsName: 'ov'
        },
    },
    FRONTPAGE_4: {
        name: 'frontpage_4',
        image: {
            dynamicImageSeededForCmsName: 'ohma'
        }
    },
    FOOTER_SPONSOR_1: {
        name: 'footer_sponsor_1',
        image: {
            dynamicImageSeededForCmsName: 'nordic'
        }
    },
    FOOTER_SPONSOR_2: {
        name: 'footer_sponsor_2',
        image: {
            dynamicImageSeededForCmsName: 'kongsberg'
        }
    },
    FOOTER_SPONSOR_3: {
        name: 'footer_sponsor_3',
        image: {
            dynamicImageSeededForCmsName: 'ov'
        }
    }
}

type CmsParagraphSeedSpecialConfig = {
    [T in SpecialCmsParagraph]: SeedCmsParagraph;
}

export const seedSpecialCmsParagraphConfig: CmsParagraphSeedSpecialConfig = {
    FRONTPAGE_1: {
        name: 'frontpage_1_paragraph',
        file: 'frontpage/frontpage_1.md'
    },
    FRONTPAGE_2: {
        name: 'frontpage_2_paragraph',
        file: 'frontpage/frontpage_2.md'
    },
    FRONTPAGE_3: {
        name: 'frontpage_3_paragraph',
        file: 'frontpage/frontpage_3.md'
    },
    FRONTPAGE_4: {
        name: 'frontpage_4_paragraph',
        file: 'frontpage/frontpage_4.md'
    },
    INTEREST_GROUP_GENERAL_INFO: {
        name: 'interest_group_general_info',
        file: 'interest_groups/general_info.md'
    },
    CAREER_INFO: {
        name: 'career_info',
        file: 'career/career_info.md'
    },
    CABIN_CONTRACT: {
        name: 'cabin_contract',
        file: 'cabin/cabin_contract.md'
    },
}


export type CmsConfig = {
    cmsImages: SeedCmsImage[], //this is a cmsImage without a connection to a cmsArticleSection
    cmsParagraphs: SeedCmsParagraph[], //this is a cmsParagraph without a connection to a cmsArticleSection
    cmsLink: SeedCmsLink[], //this is a cmsLink without a connection to a cmsArticleSection

    articleSections: SeedArticleSection[], //this is a cmsArticleSection without a connection to a Article

    articles: SeedArticle[],
}

/**
 * This is the configuration for the cms content that are to be seeded. This is the dynamic
 * cms content to be seeded - i.e. the content may be deleted in the future.
 */
export const seedCmsConfig: CmsConfig = {
    cmsImages: [],
    cmsParagraphs: [],
    cmsLink: [],
    articleSections: [],
    articles: [
        {
            name: 'velkommen til nye veven',
            category: 'news',
            description: 'ny vev',
            orderPublished: 105,
            coverImage: {
                name: 'velkommen_til_nye_veven_cover',
                imageName: 'logo_simple',
                imageSize: 'LARGE'
            },
            articleSections: [
                {
                    name: 'velkommen_til_nye_veven_1',
                    cmsParagraph: {
                        name: 'velkommen_til_nye_veven_1_paragraph',
                        file: 'news/velkommen_til_nye_veven_1.md'
                    },
                    cmsImage: {
                        name: 'velkommen_til_nye_veven_1_image',
                        imageName: 'kappemann',
                        imageSize: 'LARGE'
                    }
                }
            ]
        },
        {
            name: 'om omega',
            category: 'om omega',
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
            category: 'om omega',
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
        {
            name: 'prikkreglement',
            category: 'guider',
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
            category: 'guider',
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
        },
    ]
}


type ArticleSeedSpecialConfig = {
    [T in SpecialCmsArticle]: SeedArticle;
}

export const seedSpecialCmsArticleConfig: ArticleSeedSpecialConfig = {
    REPORT_PAGE: {
        category: 'special',
        name: 'Varslingside',
        coverImage: {
            name: 'varslingside_cover',
            imageName: 'ov',
            imageSize: 'MEDIUM'
        },
        articleSections: [
            {
                name: 'varsling_info_1',
                cmsParagraph: {
                    name: 'varsling_info_1_paragraph',
                    file: 'varsling_info/varsling_info_1.md'
                }
            }
        ]
    },
    NEW_STUDENT_PAGE: {
        category: 'special',
        name: 'New Student',
        coverImage: {
            name: 'newStudentPage_cover',
            imageName: 'ov',
            imageSize: 'MEDIUM'
        },
        articleSections: [
            {
                name: 'new_student_info',
                cmsParagraph: {
                    name: 'new_student_1_paragraph',
                    file: 'new_student/new_student_1.md'
                }
            }
        ]
    },
}
