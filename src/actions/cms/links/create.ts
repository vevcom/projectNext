'use server'
import { createCmsLink } from '@/server/cms/links/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createCmsLinkSchema } from '@/server/cms/links/schema'
import { createZodActionError } from '@/actions/error'
import type { CreateCmsLinkType } from '@/server/cms/links/schema'
import type { ActionReturn } from '@/actions/Types'
import type { CmsLink } from '@prisma/client'

export async function createCmsLinkAction(rawData: FormData | CreateCmsLinkType): Promise<ActionReturn<CmsLink>> {
    //TODO: Auth on permission to create cms
    const parse = createCmsLinkSchema.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createCmsLink(data))
}
