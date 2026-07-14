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

type SpecialCmsImageSeederConfig = {
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
    articles: 
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
