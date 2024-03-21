'use server'
import { createArticleSection } from '@/server/cms/articleSections/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createArticleCategorySchema } from '@/server/cms/articleCategories/validation'
import { createZodActionError } from '@/actions/error'
import type { CreateArticleCategoryTypes } from '@/server/cms/articleCategories/validation'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'

export async function createArticleSectionAction(
    rawData: FormData | CreateArticleCategoryTypes['Type'],
): Promise<ActionReturn<ExpandedArticleSection>> {
    //TODO: Auth on general cms permission
    const parse = createArticleCategorySchema.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticleSection(data))
}
