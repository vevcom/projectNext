'use server'
import { readArticleSection } from '@/server/cms/articleSections/read'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'
import { safeServerCall } from '@/actions/safeServerCall'

export async function readArticleSectionAction(name: string): Promise<ActionReturn<ExpandedArticleSection>> {
    //TODO: Auth by visibility
    return await safeServerCall(() => readArticleSection(name))
}
