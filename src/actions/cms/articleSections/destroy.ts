'use server'
import { destroyArticleSection } from '@/server/cms/articleSections/destroy'
import type { ActionReturn } from '@/actions/Types'
import type { ArticleSection } from '@prisma/client'
import { safeServerCall } from '@/actions/safeServerCall'

export async function destroyArticleSectionAction(nameOrId: string): Promise<ActionReturn<ArticleSection>> {
    //Auth by visibility
    return await safeServerCall(() => destroyArticleSection(nameOrId))
}
