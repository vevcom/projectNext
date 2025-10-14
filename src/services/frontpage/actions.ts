import { frontpageOperations } from './operations'
import { makeAction } from '@/services/serverAction'


export const readSpecialCmsParagraphFrontpageSection = makeAction(
    frontpageOperations.readSpecialCmsParagraphFrontpageSection
)

export const updateSpecialCmsParagraphFrontpageSection = makeAction(
    frontpageOperations.updateSpecialCmsParagraphContentFrontpageSection
)
