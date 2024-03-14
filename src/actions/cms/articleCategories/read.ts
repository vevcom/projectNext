'use server'
import type { ActionReturn } from '@/actions/Types'
import type {
    ExpandedArticleCategoryWithCover,
    ArticleCategoryWithCover,
} from '@/cms/articleCategories/Types'
import { readArticleCategories, readArticleCategory } from '@/server/cms/articleCategories/read'

export async function readArticleCategoriesAction(): Promise<ActionReturn<ArticleCategoryWithCover[]>> {
    //TODO: only read categories that user has visibility
    return await readArticleCategories()
}

export async function readArticleCategoryAction(name: string): Promise<ActionReturn<ExpandedArticleCategoryWithCover>> {
    //TODO: only read if right visibility
    return await readArticleCategory(name)
}