import { ImageSize } from '@prisma/client'

type SeedCmsImage = {
    name: string,
    imageName: string
    imageSize?: ImageSize
}

type SeedCmsParagraph = {
    name: string,
    file: string //location in cms_paragraphs folder
}

type SeedCmsLink = {
    name: string,
    url: string
}

type SeedCmsArticleSection = {
    name: string,
    cmsImage?: SeedCmsImage,
    cmsParagraph?: SeedCmsParagraph,
    cmsLink?: SeedCmsLink
}

type SeedArticle = {
    name: string,
    coverImageName: SeedCmsImage,
    articleSections: SeedCmsArticleSection[]
}

type CmsContent = {
    cmsImages: SeedCmsImage[], //this is a cmsImage without a connection to a cmsArticleSection
    cmsParagraphs: SeedCmsParagraph[], //this is a cmsParagraph without a connection to a cmsArticleSection
    cmsLink: SeedCmsLink[], //this is a cmsLink without a connection to a cmsArticleSection

    articleSections: SeedCmsArticleSection[], //this is a cmsArticleSection without a connection to a Article
    
    articles: SeedArticle[],
}

//this object describes the starting state of all cmsimages
const standardCmsContents : CmsContent = {
    cmsImages: [
        {
            name: 'frontpage_logo',
            imageName: 'logo_white',
            imageSize: 'LARGE'
        },
        {
            name: 'frontpage_1',
            imageName: 'kappemann',
        },
        {
            name: 'frontpage_2',
            imageName: 'ov',
        },
        {
            name: 'frontpage_3',
            imageName: 'ov',
        },
        {
            name: 'frontpage_4',
            imageName: 'ohma',
        },
        {
            name: 'server-error',
            imageName: 'logo_simple',
        },
        {
            name: 'not-found',
            imageName: 'logo_simple',
        },
        {
            name: 'auth_icon',
            imageName: 'magisk_hatt',
        },
        {
            name: 'footer_logo',
            imageName: 'omega_logo_white',
        },
        {
            name: 'footer_1',
            imageName: 'pwa',
        },
        {
            name: 'footer_2',
            imageName: 'nordic',
            imageSize: 'SMALL'
        },
        {
            name: 'footer_3',
            imageName: 'kongsberg',
        },
        {
            name: 'loader_image',
            imageName: 'logo_simple'
        },
        {
            name: 'mobile_nav_primary_button',
            imageName: 'logo_simple',
            imageSize: 'SMALL'
        },
        {
            name: 'mobile_nav_login_button',
            imageName: 'magisk_hatt',
            imageSize: 'SMALL'
        },
        {
            name: 'nav_primary_button',
            imageName: 'logo_simple',
            imageSize: 'SMALL'
        },
        {
            name: 'nav_login_button',
            imageName: 'magisk_hatt',
            imageSize: 'SMALL'
        }
    ],
    cmsParagraphs: [

    ],
    cmsLink: [

    ],
    articleSections: [

    ],
    articles: [

    ]
}

export default standardCmsContents
