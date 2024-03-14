'use server'
import { articleCategorySchema } from './schema'
import { createZodActionError } from '@/actions/error'
import { updateArticleCategory } from '@/server/cms/articleCategories/update'
import type { ArticleCategorySchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleCategory } from '@/cms/articleCategories/Types'

export async function updateArticleCategoryVisibilityAction(
    // disable eslint rule temporarily until function is implemented
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: number,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    visibility: unknown
): Promise<ActionReturn<ExpandedArticleCategory>> {
    throw new Error('Not implemented')
}

export async function updateArticleCategoryAction(
    id: number,
    rawData: FormData | ArticleCategorySchemaType
): Promise<ActionReturn<ExpandedArticleCategory>> {
    const parse = articleCategorySchema.safeParse(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    return await updateArticleCategory(id, data)
}
