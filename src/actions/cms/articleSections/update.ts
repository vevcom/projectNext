'use server'
import { articleSectionsRealtionsIncluder } from '@/cms/articleSections/ConfigVars'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import { createCmsImage } from '@/server/cms/images/create'
import { createCmsParagraph } from '@/server/cms/paragraphs/create'
import { createCmsLink } from '@/server/cms/links/create'
import type { ArticleSection, Position } from '@prisma/client'
import type { ArticleSectionPart, ExpandedArticleSection } from '@/cms/articleSections/Types'
import type { ActionReturn } from '@/actions/Types'
import { addArticleSectionPart, removeArticleSectionPart } from '@/server/cms/articleSections/update'


export async function updateArticleSectionAction(name: string, changes: {
    imageSize?: number,
    imagePosition?: Position,
}): Promise<ActionReturn<ExpandedArticleSection>> {
    //Todo: Auth by visibilty
    return await updateArticleSectionAction(name, changes)
}

export async function addArticleSectionPartAction(
    name: string, 
    part: ArticleSectionPart
): Promise<ActionReturn<ExpandedArticleSection>> {
    //Todo: Auth by visibilty
    return await addArticleSectionPart(name, part)
}

export async function removeArticleSectionPartAction(
    name: string, 
    part: ArticleSectionPart
): Promise<ActionReturn<ArticleSection>> {
    //TODO: Auth by visibility
   return await removeArticleSectionPart(name, part)
}
