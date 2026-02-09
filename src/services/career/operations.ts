import '@pn-server-only'
import { careerAuth } from './auth'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { cmsLinkOperations } from '@/cms/links/operations'

export const careerOperations = {
    readSpecialCmsParagraphCareerInfo: cmsParagraphOperations.readSpecial.implement({
        authorizer: () => careerAuth.readSpecialCmsParagraphCareerInfo.dynamicFields({}),
        ownershipCheck: ({ params }) => params.special === 'CAREER_INFO'
    }),

    updateSpecialCmsParagraphContentCareerInfo: cmsParagraphOperations.updateContent.implement({
        authorizer: () => careerAuth.updateSpecialCmsParagraphContentCareerInfo.dynamicFields({}),
        ownershipCheck: async ({ params }) =>
            await cmsParagraphOperations.isSpecial({
                params: { paragraphId: params.paragraphId, special: ['CAREER_INFO'] },
                bypassAuth: true,
            })
    }),

    readSpecialCmsLink: cmsLinkOperations.readSpecial.implement({
        authorizer: () => careerAuth.readSpecialCmsLink.dynamicFields({}),
        ownershipCheck: ({ params }) => params.special === 'CAREER_LINK_TO_CONTACTOR'
    }),

    updateSpecialCmsLink: cmsLinkOperations.update.implement({
        authorizer: () => careerAuth.updateSpecialCmsLink.dynamicFields({}),
        ownershipCheck: ({ params }) =>
            cmsLinkOperations.isSpecial({
                params: {
                    linkId: params.linkId,
                    special: ['CAREER_LINK_TO_CONTACTOR']
                }
            })
    }),
}
