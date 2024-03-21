'use server'
import { createCmsParagraphActionValidation } from './schema'
import { createCmsParagraph } from '@/server/cms/paragraphs/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import type { CreateCmsParagraphActionTypes } from './schema'
import type { CmsParagraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function createCmsParagraphAction(
    rawData: FormData | CreateCmsParagraphActionTypes['Type']
): Promise<ActionReturn<CmsParagraph>> {
    //TDOD: Auth on cms permission (few should be able to create a paragraph standalone)
    const parse = createCmsParagraphActionValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createCmsParagraph(data))
}
