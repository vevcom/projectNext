'use server'
import { createArticleSection } from '@/server/cms/articleSections/create'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'
import { safeServerCall } from '@/actions/safeServerCall'

export async function createArticleSectionAction(name: string): Promise<ActionReturn<ExpandedArticleSection>> {
    //TODO: Auth on general cms permission
    return await safeServerCall(() => createArticleSection(name))
}
