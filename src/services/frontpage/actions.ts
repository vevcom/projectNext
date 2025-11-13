'use server'
import { frontpageOperations } from './operations'
import { makeAction } from '@/services/serverAction'

export const readSpecialCmsParagraphFrontpageSection = makeAction(
    frontpageOperations.readSpecialCmsParagraphFrontpageSection
)

export const updateSpecialCmsParagraphFrontpageSection = makeAction(
    frontpageOperations.updateSpecialCmsParagraphContentFrontpageSection
)

export const readSpecialCmsImageFrontpage = makeAction(
    frontpageOperations.readSpecialCmsImage
)

export const updateSpecialCmsImageFrontpage = makeAction(
    frontpageOperations.updateSpecialCmsImage
)
