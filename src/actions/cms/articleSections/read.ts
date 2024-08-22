'use server'
import { readArticleSection } from '@/server/cms/articleSections/read'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'

export async function readArticleSectionAction(name: string): Promise<ActionReturn<ExpandedArticleSection>> {
    //TODO: Auth by visibility
    return await safeServerCall(() => readArticleSection(name))
}
