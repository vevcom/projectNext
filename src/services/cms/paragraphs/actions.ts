'use server'

import { createActionError, createZodActionError, safeServerCall } from '@/services/actionError'
import { createCmsParagraph } from '@/services/cms/paragraphs/create'
import { readCmsParagraph, readSpecialCmsParagraph } from '@/services/cms/paragraphs/read'
import { updateCmsParagraphContents } from '@/services/cms/paragraphs/update'
import { baseCmsParagraphValidation } from '@/services/cms/paragraphs/validation'
import { SpecialCmsParagraph } from '@prisma/client'
import type { ValidationTypes } from '@/services/Validation'
import type { ActionReturn } from '@/services/actionTypes'
import type { CmsParagraph } from '@prisma/client'

export const createCmsParagraphActionValidation = baseCmsParagraphValidation.createValidation({
    keys: ['name'],
    transformer: data => data
})

export type CreateCmsParagraphActionTypes = ValidationTypes<typeof createCmsParagraphActionValidation>

export async function createCmsParagraphAction(
    rawData: FormData | CreateCmsParagraphActionTypes['Type']
): Promise<ActionReturn<CmsParagraph>> {
    //TDOD: Auth on cms permission (few should be able to create a paragraph standalone)
    const parse = createCmsParagraphActionValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createCmsParagraph(data))
}

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
        return await safeServerCall(() => createCmsParagraph({
            name: special,
            special,
        }))
    }
    return specialRes
}

export async function updateCmsParagraphAction(id: number, contentMd: string): Promise<ActionReturn<CmsParagraph>> {
    //TODO: Auth on visibility
    return await safeServerCall(() => updateCmsParagraphContents(id, contentMd))
}
