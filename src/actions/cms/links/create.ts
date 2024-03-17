'use server'
import { createCmsLink } from '@/server/cms/links/create'
import type { ActionReturn } from '@/actions/Types'
import type { CmsLink } from '@prisma/client'
import { safeServerCall } from '@/actions/safeServerCall'

export async function createCmsLinkAction(name: string): Promise<ActionReturn<CmsLink>> {
    //TODO: Auth on permission to create cms
    return await safeServerCall(() => createCmsLink(name))
}
