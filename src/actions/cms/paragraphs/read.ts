'use server'
import { createCmsParagraph } from '@/server/cms/paragraphs/create'
import { createActionError } from '@/actions/error'
import { readCmsParagraph, readSpecialCmsParagraph } from '@/server/cms/paragraphs/read'
import { SpecialCmsParagraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { CmsParagraph } from '@prisma/client'
import { safeServerCall } from '@/actions/safeServerCall'

export async function readCmsParagraphAction(name: string): Promise<ActionReturn<CmsParagraph>> {
    //TODO: Auth on visibility (or permission if special)
    return await safeServerCall(() => readCmsParagraph(name))
}

/**
 * This action reads a special paragraph from the database, if it does not exist it will create it
 * @param special - special paragraph to read
 * @returns - the paragraph
 */
export async function readSpecialCmsParagraphAction(special: SpecialCmsParagraph): Promise<ActionReturn<CmsParagraph>> {
    if (!Object.values(SpecialCmsParagraph).includes(special)) {
        return createActionError('BAD PARAMETERS', `${special} is not special`)
    }

    const specialRes = await safeServerCall(() => readSpecialCmsParagraph(special))
    if (specialRes.success) return specialRes
    if (specialRes.errorCode === 'NOT FOUND') {
        return await safeServerCall(() => createCmsParagraph(special, { special }))
    }
    return specialRes
}
