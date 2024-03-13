'use server'
import type { ActionReturn } from '@/actions/Types'
import type { CmsLink } from '@prisma/client'
import { createCmsLink } from '@/server/cms/links/create'

export async function createCmsLinkAction(name: string): Promise<ActionReturn<CmsLink>> {
    //TODO: Auth on permission to create cms
    return await createCmsLink(name)
}
