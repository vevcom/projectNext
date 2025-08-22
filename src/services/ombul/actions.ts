'use server'

import { createActionError, createZodActionError } from '@/actions/error'
import { safeServerCall } from '@/actions/safeServerCall'
import { getUser } from '@/auth/getUser'
import { createOmbul } from '@/services/ombul/create'
import { destroyOmbul } from '@/services/ombul/destroy'
import { readLatestOmbul, readOmbul, readOmbuls } from '@/services/ombul/read'
import { updateOmbul, updateOmbulFile } from '@/services/ombul/update'
import { createOmbulValidation, updateOmbulFileValidation, updateOmbulValidation } from '@/services/ombul/validation'
import type { ExpandedOmbul } from '@/services/ombul/Types'
import type { ActionReturn } from '@/actions/Types'
import type { CreateOmbulTypes, UpdateOmbulFileTypes, UpdateOmbulTypes } from '@/services/ombul/validation'
import type { Ombul } from '@prisma/client'

/**
 * Create a new Ombul.
 * @param rawData includes a pdf file with the ombul issue optionaly year and issueNumber
 * @param CoverImageId is the id of the Image that will be used as the cover of the ombul
 */
export async function createOmbulAction(rawdata: FormData | CreateOmbulTypes['Type']): Promise<ActionReturn<Ombul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_CREATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = createOmbulValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createOmbul(data))
}

export async function destroyOmbulAction(id: number): Promise<ActionReturn<ExpandedOmbul>> {
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_DESTROY']]
    })

    if (!authorized) return createActionError(status)

    return await safeServerCall(() => destroyOmbul(id))
}

export async function readLatestOmbulAction(): Promise<ActionReturn<Ombul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readLatestOmbul())
}

export async function readOmbulAction(idOrNameAndYear: number | {
    name: string,
    year: number,
}): Promise<ActionReturn<ExpandedOmbul>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_READ']]
    })
    if (!authorized) return createActionError(status)

    return await safeServerCall(() => readOmbul(idOrNameAndYear))
}

export async function readOmbulsAction(): Promise<ActionReturn<ExpandedOmbul[]>> {
    //Auth route
    const { status, authorized } = await getUser({
        requiredPermissions: [['OMBUL_READ']]
    })
    if (!authorized) {
        return createActionError(status)
    }
    return await safeServerCall(() => readOmbuls())
}

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
