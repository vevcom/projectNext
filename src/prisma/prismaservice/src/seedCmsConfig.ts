import type {
    Position,
    ImageSize,
    SpecialCmsImage,
    SpecialCmsParagraph,
} from '@/generated/pn'


export type SeedCmsImage = {
    name: string,
    imageName: string
    imageSize?: ImageSize
}

export type SeedCmsParagraph = {
    name: string,
    file: string //location in cms_paragraphs folder
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
    articleSections: SeedArticleSection[]
} & ({
    category: Categories
} | {
    category: 'news',
    description: string,
    orderPublished: number
})


type CmsImageSeedSpecialConfig = {
    [T in SpecialCmsImage]: SeedCmsImage;
}

export const seedSpecialCmsImageConfig: CmsImageSeedSpecialConfig = {
    FRONTPAGE_LOGO: {
        name: 'frontpage_logo',
        imageName: 'logo_white',
        imageSize: 'LARGE'
    },
    FRONTPAGE_1: {
        name: 'frontpage_1',
        imageName: 'kappemann',
    },
    FRONTPAGE_2: {
        name: 'frontpage_2',
        imageName: 'ohma',
    },
    FRONTPAGE_3: {
        name: 'frontpage_3',
        imageName: 'ov',
    },
    FRONTPAGE_4: {
        name: 'frontpage_4',
        imageName: 'ohma',
    },
    SERVER_ERROR: {
        name: 'server-error',
        imageName: 'logo_simple',
    },
    NOT_FOUND: {
        name: 'not-found',
        imageName: 'logo_simple',
    },
    AUTH_ICON: {
        name: 'auth_icon',
        imageName: 'magisk_hatt',
    },
    FOOTER_LOGO: {
        name: 'footer_logo',
        imageName: 'logo_white_text',
    },
    FOOTER_1: {
        name: 'footer_1',
        imageName: 'pwa',
    },
    FOOTER_2: {
        name: 'footer_2',
        imageName: 'nordic',
        imageSize: 'SMALL'
    },
    FOOTER_3: {
        name: 'footer_3',
        imageName: 'kongsberg',
    },
    LOADER_IMAGE: {
        name: 'loader_image',
        imageName: 'logo_simple'
    },
    MOBILE_NAV_PRIMARY_BUTTON: {
        name: 'mobile_nav_primary_button',
        imageName: 'logo_simple',
        imageSize: 'SMALL'
    },
    MOBILE_NAV_LOGIN_BUTTON: {
        name: 'mobile_nav_login_button',
        imageName: 'magisk_hatt',
        imageSize: 'SMALL'
    },
    NAV_PRIMARY_BUTTON: {
        name: 'nav_primary_button',
        imageName: 'logo_simple',
        imageSize: 'SMALL'
    },
    NAV_LOGIN_BUTTON: {
        name: 'nav_login_button',
        imageName: 'magisk_hatt',
        imageSize: 'SMALL'
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
}


export type CmsConfig = {
    cmsImages: SeedCmsImage[], //this is a cmsImage without a connection to a cmsArticleSection
    cmsParagraphs: SeedCmsParagraph[], //this is a cmsParagraph without a connection to a cmsArticleSection
    cmsLink: SeedCmsLink[], //this is a cmsLink without a connection to a cmsArticleSection

    articleSections: SeedArticleSection[], //this is a cmsArticleSection without a connection to a Article

    articles: SeedArticle[],
}
/**
 * This is the configuration for the cms content that are to be seeded
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
        }
    ]
}
