import { frontpageOperations } from './operations'
import { makeAction } from '@/services/serverAction'


export const readSpecialCmsParagraphFrontpageSection = makeAction(
    frontpageOperations.readSpecialCmsParagraphFrontpageSection
)
