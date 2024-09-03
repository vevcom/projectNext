'use server'
import { createZodActionError } from '@/actions/error'
import { addSectionToArticle, moveSectionOrder, updateArticle } from '@/services/cms/articles/update'
import { safeServerCall } from '@/actions/safeServerCall'
import { updateArticleValidation } from '@/services/cms/articles/validation'
import type { UpdateArticleTypes } from '@/services/cms/articles/validation'
import type { ArticleSectionPart } from '@/services/cms/articleSections/Types'
import type { ActionReturn } from '@/actions/Types'
import type { ArticleSection } from '@prisma/client'
import type { ExpandedArticle } from '@/cms/articles/Types'

export async function updateArticleAction(
    id: number,
    rawData: FormData | UpdateArticleTypes['Type']
): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth on visability
    const parse = updateArticleValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateArticle(id, data))
}

export async function addSectionToArticleAction(
    id: number,
    include: Partial<Record<ArticleSectionPart, boolean>>
): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth on visability
    return await safeServerCall(() => addSectionToArticle(id, include))
}

export async function moveSectionOrderAction(
    id: number,
    sectionId: number,
    direction: 'UP' | 'DOWN'
): Promise<ActionReturn<ArticleSection>> {
    //TODO: auth on visability
    return await safeServerCall(() => moveSectionOrder(id, sectionId, direction))
}
