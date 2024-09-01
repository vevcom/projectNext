'use server'
import { createArticleSection } from '@/services/cms/articleSections/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createArticleSectionValidation } from '@/services/cms/articleSections/validation'
import type { CreateArticleSectionTypes } from '@/services/cms/articleSections/validation'
import type { ActionReturn } from '@/actions/Types'
import type { ExpandedArticleSection } from '@/cms/articleSections/Types'

export async function createArticleSectionAction(
    rawData: FormData | CreateArticleSectionTypes['Type'],
): Promise<ActionReturn<ExpandedArticleSection>> {
    //TODO: Auth on general cms permission
    const parse = createArticleSectionValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createArticleSection(data))
}
