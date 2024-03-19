'use server'
import { createArticleSection } from '@/server/cms/articleSections/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createArticleCategorySchema } from '@/server/cms/articleCategories/schema'
import { createZodActionError } from '@/actions/error'
import type { CreateArticleCategoryType } from '@/server/cms/articleCategories/schema'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'

export async function createArticleSectionAction(
    rawData: FormData | CreateArticleCategoryType,
): Promise<ActionReturn<ExpandedArticleSection>> {
    //TODO: Auth on general cms permission
    const parse = createArticleCategorySchema.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticleSection(data))
}
