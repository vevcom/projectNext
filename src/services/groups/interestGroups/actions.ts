'use server'

import { makeAction } from '@/services/serverAction'
import { interestGroupOperations } from '@/services/groups/interestGroups/operations'

export const createInterestGroupAction = makeAction(interestGroupOperations.create)
export const destroyInterestGroupAction = makeAction(interestGroupOperations.destroy)
export const readInterestGroupsAction = makeAction(interestGroupOperations.readMany)
export const updateInterestGroupAction = makeAction(interestGroupOperations.update)

export const readSpecialCmsParagraphGeneralInfoAction = makeAction(
    interestGroupOperations.readSpecialCmsParagraphGeneralInfo
)
export const updateSpecialCmsParagraphContentGeneralInfoAction = makeAction(
    interestGroupOperations.updateSpecialCmsParagraphContentGeneralInfo
)

export const updateInterestGroupArticleSectionAction = makeAction(
    interestGroupOperations.updateArticleSection.update
)
export const addPartToInterestGroupArticleSectionAction = makeAction(
    interestGroupOperations.updateArticleSection.addPart
)
export const removePartFromInterestGroupArticleSectionAction = makeAction(
    interestGroupOperations.updateArticleSection.removePart
)
export const updateInterestGroupCmsImageAction = makeAction(
    interestGroupOperations.updateArticleSection.cmsImage
)
export const updateInterestGroupCmsParagraphAction = makeAction(
    interestGroupOperations.updateArticleSection.cmsParagraph
)
export const updateInterestGroupCmsLinkAction = makeAction(
    interestGroupOperations.updateArticleSection.cmsLink
)
