import '@pn-server-only'
import { careerAuth } from './auth'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'

export const careerOperations = {
    readSpecialCmsParagraphCareerInfo: cmsParagraphOperations.readSpecial.implement({
        authorizer: () => careerAuth.readSpecialCmsParagraphCareerInfo.dynamicFields({}),
        ownershipCheck: ({ params }) => params.special === 'CAREER_INFO'
    }),

    updateSpecialCmsParagraphContentCareerInfo: cmsParagraphOperations.updateContent.implement({
        authorizer: () => careerAuth.updateSpecialCmsParagraphContentCareerInfo.dynamicFields({}),
        ownershipCheck: async ({ params }) =>
            await cmsParagraphOperations.isSpecial({
                params: { id: params.id, special: ['CAREER_INFO'] },
                bypassAuth: true,
            })
    })
}
