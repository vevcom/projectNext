import '@pn-server-only'
import { frontpageAuth } from './auth'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { cmsImageOperations } from '@/cms/images/operations'
import type { SpecialCmsImage, SpecialCmsParagraph } from '@/prisma-generated-pn-types'

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
    //TODO: these probably should not be read through 'frontpage'-service...
    //but I anyway feel like making some of the special cms images into just special images
    'MOBILE_NAV_LOGIN_BUTTON',
    'MOBILE_NAV_PRIMARY_BUTTON',
    'LOADER_IMAGE',
    'AUTH_ICON',
    'NAV_LOGIN_BUTTON',
    'NAV_PRIMARY_BUTTON',
    'NOT_FOUND',
    'SERVER_ERROR'
]

export const frontpageOperations = {
    readSpecialCmsParagraphSection: cmsParagraphOperations.readSpecial.implement({
        authorizer: () => frontpageAuth.readSpecialCmsParagraphSection.dynamicFields({}),
        ownershipCheck: ({ params }) => ownedCmsParagraphs.includes(params.special)
    }),

    updateSpecialCmsParagraphContentSection: cmsParagraphOperations.updateContent.implement({
        authorizer: () => frontpageAuth.updateSpecialCmsParagraphContentSection.dynamicFields({}),
        ownershipCheck: async ({ params }) =>
            await cmsParagraphOperations.isSpecial.internalCall({
                params: {
                    paragraphId: params.paragraphId,
                    special: [...ownedCmsParagraphs],
                },
            })
    }),

    readSpecialCmsImage: cmsImageOperations.readSpecial.implement({
        authorizer: () => frontpageAuth.readSpecialCmsImage.dynamicFields({}),
        ownershipCheck: ({ params }) => ownedCmsImages.includes(params.special)
    }),

    updateSpecialCmsImage: cmsImageOperations.update.implement({
        authorizer: () => frontpageAuth.updateSpecialCmsImage.dynamicFields({}),
        ownershipCheck: async ({ params }) =>
            await cmsImageOperations.isSpecial.internalCall({
                params: {
                    cmsImageId: params.cmsImageId,
                    special: [...ownedCmsImages],
                },
            })
    }),
} as const
