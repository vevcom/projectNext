'use server'
import type { CmsParagraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import { updateCmsParagraphContents } from '@/server/cms/paragraphs/update'

export async function updateCmsParagraphAction(id: number, contentMd: string): Promise<ActionReturn<CmsParagraph>> {
    //TODO: Auth on visibility
    return await updateCmsParagraphContents(id, contentMd)
}
