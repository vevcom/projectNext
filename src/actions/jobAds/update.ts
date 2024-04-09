'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import type { ActionReturn } from '@/actions/Types'
import { UpdateJobAdTypes, updateJobAdValidation } from '@/server/jobAds/validation'
import { SimpleJobAd } from '@/server/jobAds/Types'
import { updateJobAd } from '@/server/jobAds/update'

export async function updateJobAdAction(
    id: number,
    rawdata: FormData | UpdateJobAdTypes['Type']
): Promise<ActionReturn<Omit<SimpleJobAd, 'coverImage'>>> {
    //TODO: auth
    const parse = updateJobAdValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    return await safeServerCall(() => updateJobAd(id, data))
}

export async function publishJobAdAction(
    // disable eslint rule temporarily until todo is resolved
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    id: number,
    // disable eslint rule temporarily until todo is resolved
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shouldPublish: boolean
): Promise<ActionReturn<Omit<SimpleJobAd, 'coverImage'>>> {
    return createActionError('UNKNOWN ERROR', 'Not implemented')
}

// disable eslint rule temporarily until todo is resolved
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function updateVisibilityAction(id: number, visible: unknown): Promise<ActionReturn<unknown>> {
    //TODO: add visible field to news
    return createActionError('UNKNOWN ERROR', 'Not implemented')
}
