'use server'
import { createCmsLink } from '@/server/cms/links/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createCmsLinkValidation } from '@/server/cms/links/validation'
import { createZodActionError } from '@/actions/error'
import type { CreateCmsLinkTypes } from '@/server/cms/links/validation'
import type { ActionReturn } from '@/actions/Types'
import type { CmsLink } from '@prisma/client'

export async function createCmsLinkAction(
    rawData: FormData | CreateCmsLinkTypes['Type']
): Promise<ActionReturn<CmsLink>> {
    //TODO: Auth on permission to create cms
    const parse = createCmsLinkValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createCmsLink(data))
}
