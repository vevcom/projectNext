'use server'

import { createZodActionError, safeServerCall } from '@/services/actionError'
import { createArticleSection } from '@/services/cms/articleSections/create'
import { destroyArticleSection } from '@/services/cms/articleSections/destroy'
import { readArticleSection } from '@/services/cms/articleSections/read'
import { addArticleSectionPart, removeArticleSectionPart, updateArticleSection } from '@/services/cms/articleSections/update'
import { createArticleSectionValidation } from '@/services/cms/articleSections/validation'
import type { ArticleSectionPart, ExpandedArticleSection } from '@/cms/articleSections/types'
import type { ActionReturn } from '@/services/actionTypes'
import type { CreateArticleSectionTypes } from '@/services/cms/articleSections/validation'
import type { ArticleSection, Position } from '@prisma/client'

export async function createArticleSectionAction(
    rawData: FormData | CreateArticleSectionTypes['Type'],
): Promise<ActionReturn<ExpandedArticleSection>> {
    //TODO: Auth on general cms permission
    const parse = createArticleSectionValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticleSection(data))
}

export async function destroyArticleSectionAction(nameOrId: string): Promise<ActionReturn<ArticleSection>> {
    //Auth by visibility
    return await safeServerCall(() => destroyArticleSection(nameOrId))
}

export async function readArticleSectionAction(name: string): Promise<ActionReturn<ExpandedArticleSection>> {
    //TODO: Auth by visibility
    return await safeServerCall(() => readArticleSection(name))
}

export async function updateArticleSectionAction(name: string, changes: {
    imageSize?: number,
    imagePosition?: Position,
}): Promise<ActionReturn<ExpandedArticleSection>> {
    //Todo: Auth by visibilty
    return await safeServerCall(() => updateArticleSection(name, changes))
}

export async function addArticleSectionPartAction(
    name: string,
    part: ArticleSectionPart
): Promise<ActionReturn<ExpandedArticleSection>> {
    //Todo: Auth by visibilty
    return await safeServerCall(() => addArticleSectionPart(name, part))
}

export async function removeArticleSectionPartAction(
    name: string,
    part: ArticleSectionPart
): Promise<ActionReturn<ArticleSection>> {
    //TODO: Auth by visibility
    return await safeServerCall(() => removeArticleSectionPart(name, part))
}
