'use server'
import { createArticleSection } from '@/server/cms/articleSections/create'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'

export async function createArticleSectionAction(name: string): Promise<ActionReturn<ExpandedArticleSection>> {
    //TODO: Auth on general cms permission
    return await createArticleSection(name)
}
