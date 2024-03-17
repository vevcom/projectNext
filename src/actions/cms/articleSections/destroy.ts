'use server'
import { destroyArticleSection } from '@/server/cms/articleSections/destroy'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ActionReturn } from '@/actions/Types'
import type { ArticleSection } from '@prisma/client'

export async function destroyArticleSectionAction(nameOrId: string): Promise<ActionReturn<ArticleSection>> {
    //Auth by visibility
    return await safeServerCall(() => destroyArticleSection(nameOrId))
}
