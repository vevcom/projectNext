'use server'
import { addArticleSectionPart, removeArticleSectionPart, updateArticleSection } from '@/server/cms/articleSections/update'
import type { ArticleSection, Position } from '@prisma/client'
import type { ArticleSectionPart, ExpandedArticleSection } from '@/cms/articleSections/Types'
import type { ActionReturn } from '@/actions/Types'


export async function updateArticleSectionAction(name: string, changes: {
    imageSize?: number,
    imagePosition?: Position,
}): Promise<ActionReturn<ExpandedArticleSection>> {
    //Todo: Auth by visibilty
    return await updateArticleSection(name, changes)
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
