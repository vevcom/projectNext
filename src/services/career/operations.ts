import '@pn-server-only'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import { careerAuth } from './auth'

export const careerOperations = {
    readSpecialCmsParagraphCareerInfo: cmsParagraphOperations.readSpecial.implement({
        authorizer: () => careerAuth.readSpecialCmsParagraphCareerInfo.dynamicFields({}),
        ownershipCheck: ({ params }) => params.special === 'CAREER_INFO'
    }),

    updateSpecialCmsParagraphContentCareerInfo: cmsParagraphOperations.updateContent.implement({
        authorizer: () => careerAuth.updateSpecialCmsParagraphContentCareerInfo.dynamicFields({}),
        ownershipCheck: async ({ params }) =>
            await cmsParagraphOperations.isParagraphSpecial({
                params: { id: params.id, special: ['CAREER_INFO'] },
                bypassAuth: true,
            })
    })
}
