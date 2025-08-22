'use server'

import { action } from '@/services/action'
import { createZodActionError } from '@/services/actionError'
import { safeServerCall } from '@/services/actionError'
import { createCmsLink } from '@/services/cms/links/create'
import { readSpecialCmsLink } from '@/services/cms/links/read'
import { updateCmsLink } from '@/services/cms/links/update'
import { createCmsLinkValidation, updateCmsLinkValidation } from '@/services/cms/links/validation'
import type { ActionReturn } from '@/services/actionTypes'
import type { CreateCmsLinkTypes, UpdateCmsLinkTypes } from '@/services/cms/links/validation'
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

export const readSpecialCmsLinkAction = action(readSpecialCmsLink)

export async function updateCmsLinkAction(
    id: number,
    rawData: FormData | UpdateCmsLinkTypes['Type']
): Promise<ActionReturn<CmsLink>> {
    //TODO: auth on visibility
    const parse = updateCmsLinkValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    if (data.url && data.url.includes('.') && !data.url.startsWith('http://') && !data.url.startsWith('https://')) {
        data.url = `https://${data.url}`
    }
    return await safeServerCall(() => updateCmsLink(id, data))
}
