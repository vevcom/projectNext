'use server'
import { createZodActionError } from '@/actions/error'
import { updateCmsLink } from '@/server/cms/links/update'
import { safeServerCall } from '@/actions/safeServerCall'
import { updateCmsLinkSchema } from '@/server/cms/links/schema'
import type { UpdateCmsLinkType } from '@/server/cms/links/schema'
import type { CmsLink } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function updateCmsLinkAction(
    id: number,
    rawData: FormData | UpdateCmsLinkType
): Promise<ActionReturn<CmsLink>> {
    //TODO: auth on visibility
    const parse = updateCmsLinkSchema.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    if (data.url.includes('.') && !data.url.startsWith('http://') && !data.url.startsWith('https://')) {
        data.url = `https://${data.url}`
    }
    return await safeServerCall(() => updateCmsLink(id, data))
}
