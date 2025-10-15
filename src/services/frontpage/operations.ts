import '@pn-server-only'
import { frontpageAuth } from './auth'
import { cmsParagraphOperations } from '@/cms/paragraphs/operations'
import type { SpecialCmsParagraph } from '@prisma/client'

const ownedCmsParagraphs: Readonly<SpecialCmsParagraph[]> = [
    'FRONTPAGE_1',
    'FRONTPAGE_2',
    'FRONTPAGE_3',
    'FRONTPAGE_4',
]
const ownershipCheck = (special: SpecialCmsParagraph): boolean => ownedCmsParagraphs.includes(special)

export const frontpageOperations = {
    readSpecialCmsParagraphFrontpageSection: cmsParagraphOperations.readSpecial.implement({
        authorizer: () => frontpageAuth.readSpecialCmsParagraphFrontpageSection.dynamicFields({}),
        ownershipCheck: ({ params }) => ownershipCheck(params.special)
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
    })
} as const
