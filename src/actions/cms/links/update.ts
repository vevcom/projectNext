'use server'
import { articleLinkSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import { updateCmsLink } from '@/server/cms/links/update'
import type { ArticleLinkSchemaType } from './schema'
import type { CmsLink } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import { safeServerCall } from '@/actions/safeServerCall'

export async function updateCmsLinkAction(
    id: number,
    rawData: FormData | ArticleLinkSchemaType
): Promise<ActionReturn<CmsLink>> {
    //TODO: auth on visibility
    const parse = articleLinkSchema.safeParse(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    if (data.url.includes('.') && !data.url.startsWith('http://') && !data.url.startsWith('https://')) {
        data.url = `https://${data.url}`
    }
    return await safeServerCall(() => updateCmsLink(id, data))
}
