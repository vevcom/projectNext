import { ImageSize } from '@prisma/client'

type CmsContent = {
    cmsImages: {
        name: string,
        imageName: string
        imageSize?: ImageSize
    }[],
    cmsParagraphs: {
        name: string,
        text: string
    }[]
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
    cmsParagraphs: []
}

export default standardCmsContents
