'use server'
import { createCmsParagraph } from '@/server/cms/paragraphs/create'
import type { CmsParagraph, SpecialCmsParagraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function createCmsParagraphAction(name: string, config?: {
    special?: SpecialCmsParagraph
}): Promise<ActionReturn<CmsParagraph>> {
    //TDOD: Auth on cms permission (few should be able to create a paragraph standalone)
    return await createCmsParagraph(name, config)
}
