'use server'
import type { ActionReturn } from '@/actions/Types'
import type { ArticleSection } from '@prisma/client'
import { destroyArticleSection } from '@/server/cms/articleSections/destroy'

export async function destroyArticleSectionAction(nameOrId: string): Promise<ActionReturn<ArticleSection>> {
    //Auth by visibility
    return await destroyArticleSection(nameOrId)
}
