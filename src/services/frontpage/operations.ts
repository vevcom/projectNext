import '@pn-server-only'
import { frontpageAuth } from './auth'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { cmsImageOperations } from '@/cms/images/operations'
import type { SpecialCmsImage, SpecialCmsParagraph } from '@prisma/client'

const ownedCmsParagraphs: Readonly<SpecialCmsParagraph[]> = [
    'FRONTPAGE_1',
    'FRONTPAGE_2',
    'FRONTPAGE_3',
    'FRONTPAGE_4',
]

const ownedCmsImages: Readonly<SpecialCmsImage[]> = [
    'FRONTPAGE_1',
    'FRONTPAGE_2',
    'FRONTPAGE_3',
    'FRONTPAGE_4',
    'FOOTER_1',
    'FOOTER_2',
    'FOOTER_3',
    'FOOTER_LOGO',
    'FRONTPAGE_LOGO',
    'FRONTPAGE_LOGO',
    'MOBILE_NAV_LOGIN_BUTTON',
    'MOBILE_NAV_PRIMARY_BUTTON',
    'LOADER_IMAGE',
    'AUTH_ICON',
    //TODO: these probably should not be read through 'frontpage'
    //but I anyway feel like making some of the special cms images into just special images
    'NAV_LOGIN_BUTTON',
    'NAV_PRIMARY_BUTTON',
    'NOT_FOUND',
    'SERVER_ERROR'
]

export const frontpageOperations = {
    readSpecialCmsParagraphFrontpageSection: cmsParagraphOperations.readSpecial.implement({
        authorizer: () => frontpageAuth.readSpecialCmsParagraphFrontpageSection.dynamicFields({}),
        ownershipCheck: ({ params }) => ownedCmsParagraphs.includes(params.special)
    }),

    updateSpecialCmsParagraphContentFrontpageSection: cmsParagraphOperations.updateContent.implement({
        authorizer: () => frontpageAuth.updateSpecialCmsParagraphContentFrontpageSection.dynamicFields({}),
        ownershipCheck: async ({ params }) =>
            await cmsParagraphOperations.isParagraphSpecial({
                params: {
                    id: params.id,
                    special: [...ownedCmsParagraphs],
                },
                bypassAuth: true
            })
    }),

    readSpecialCmsImage: cmsImageOperations.readSpecial.implement({
        authorizer: () => frontpageAuth.readSpecialCmsImage.dynamicFields({}),
        ownershipCheck: ({ params }) => ownedCmsImages.includes(params.special)
    }),

    updateSpecialCmsImage: cmsImageOperations.update.implement({
        authorizer: () => frontpageAuth.updateSpecialCmsImage.dynamicFields({}),
        ownershipCheck: async ({ params }) =>
            await cmsImageOperations.isSpecial({
                params: {
                    id: params.id,
                    special: [],
                },
                bypassAuth: true
            })
    }),
} as const
