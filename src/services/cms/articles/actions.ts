'use server'

import { specialArticleOperations } from './operations'
import { createZodActionError, safeServerCall } from '@/services/actionError'
import { createArticle } from '@/services/cms/articles/create'
import { destroyArticle } from '@/services/cms/articles/destroy'
import { readArticle } from '@/services/cms/articles/read'
import { addSectionToArticle, moveSectionOrder, updateArticle } from '@/services/cms/articles/update'
import { createArticleValidation, updateArticleValidation } from '@/services/cms/articles/validation'
import { makeAction } from '@/services/serverAction'
import type { ExpandedArticle } from '@/cms/articles/types'
import type { ActionReturn } from '@/services/actionTypes'
import type { CreateArticleTypes, UpdateArticleTypes } from '@/services/cms/articles/validation'
import type { ArticleSectionPart } from '@/cms/articleSections/types'
import type { Article, ArticleSection } from '@prisma/client'


export async function createArticleAction(
    rawData: FormData | CreateArticleTypes['Type'],
    categoryId?: number,
): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth on permission or visibility to categoryId

    const parse = createArticleValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticle(data, categoryId))
}

export async function destroyArticleAction(id: number): Promise<ActionReturn<Article>> {
    //TODO: auth
    return await safeServerCall(() => destroyArticle(id))
}

export async function readArticleAction(idOrName: number | {
    name: string,
    category: string
}): Promise<ActionReturn<ExpandedArticle>> {
    //TODO: auth
    return await safeServerCall(() => readArticle(idOrName))
}

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

export const readSpecialArticle = makeAction(specialArticleOperations.read)
