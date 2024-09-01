'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { createImage } from '@/services/images/create'
import { createImagesValidation, createImageValidation } from '@/services/images/validation'
import type { ActionReturn } from '@/actions/Types'
import type { Image } from '@prisma/client'
import type { CreateImageTypes, CreateImagesTypes } from '@/services/images/validation'

export async function createImageAction(
    collectionId: number,
    rawdata: FormData | CreateImageTypes['Type']
): Promise<ActionReturn<Image>> {
    //TODO: add auth

    const parse = createImageValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createImage({ ...data, collectionId }))
}

export async function createImagesAction(
    collectionId: number,
    rawdata: FormData | CreateImagesTypes['Type']
): Promise<ActionReturn<Image[]>> {
    //TODO: add auth

    const parse = createImagesValidation.typeValidate(rawdata)

    if (!parse.success) return createZodActionError(parse)

    const data = parse.data

    let finalReturn: ActionReturn<Image[]> = { success: true, data: [] }
    for (const file of data.files) {
        const ret = await safeServerCall(
            () => createImage({ file, name: file.name.split('.')[0], alt: file.name.split('.')[0], collectionId })
        )
        if (!ret.success) return ret
        finalReturn = {
            ...finalReturn,
            success: ret.success,
        }
        finalReturn.data.push(ret.data)
    }
    return finalReturn
}
