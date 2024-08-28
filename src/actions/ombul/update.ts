'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createActionError, createZodActionError } from '@/actions/error'
import { getUser } from '@/auth/getUser'
import { updateOmbul, updateOmbulFile } from '@/services/ombul/update'
import { updateOmbulFileValidation, updateOmbulValidation } from '@/services/ombul/validation'
import type { UpdateOmbulFileTypes, UpdateOmbulTypes } from '@/services/ombul/validation'
import type { ExpandedOmbul } from '@/services/ombul/Types'
import type { ActionReturn } from '@/actions/Types'

/**
 * A action to update an ombul
 * @param id - The id of the ombul to update
 * @param rawdata - The new data for the ombul including: name, year, issueNumber, description,
 * @returns The updated ombul
 */
export async function updateOmbulAction(
    id: number,
    rawdata: FormData | UpdateOmbulTypes['Type']
): Promise<ActionReturn<ExpandedOmbul>> {
    // Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_UPDATE']]
    })
    if (!authorized) return createActionError(status)

    //Parse the data
    const parse = updateOmbulValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateOmbul(id, data))
}

/**
 * A action that updates the ombul file (i.e. the pdf file) of an ombul
 * @param id - The id of the ombul to update
 * @param rawData - The new data for the new ombul file with field name 'file'
 * @returns The updated ombul
 */
export async function updateOmbulFileAction(
    id: number,
    rawData: FormData | UpdateOmbulFileTypes['Type']
): Promise<ActionReturn<ExpandedOmbul>> {
    // auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_UPDATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = updateOmbulFileValidation.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => updateOmbulFile(id, data))
}
