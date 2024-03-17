'use server'
import { updateCmsParagraphContents } from '@/server/cms/paragraphs/update'
import { safeServerCall } from '@/actions/safeServerCall'
import type { CmsParagraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function updateCmsParagraphAction(id: number, contentMd: string): Promise<ActionReturn<CmsParagraph>> {
    //TODO: Auth on visibility
    return await safeServerCall(() => updateCmsParagraphContents(id, contentMd))
}
