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
        ownershipCheck: async ({ params, prisma }) => {
            const paragraph = await prisma.cmsParagraph.findUnique({
                where: { id: params.id },
                select: { special: true }
            })
            if (!paragraph) return false
            if (!paragraph.special) return false
            return ownershipCheck(paragraph.special)
        }
    })
} as const
