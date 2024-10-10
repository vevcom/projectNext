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
    useFileName: boolean,
    collectionId: number,
    rawdata: FormData | CreateImagesTypes['Type']
): Promise<ActionReturn<void>> {
    //TODO: add auth

    const parse = createImagesValidation.typeValidate(rawdata)

    if (!parse.success) return createZodActionError(parse)

    const data = parse.data

    let finalReturn: ActionReturn<void> = { success: true, data: undefined }
    for (const file of data.files) {
        const name = useFileName ? file.name.split('.')[0] : undefined
        const ret = await safeServerCall(
            () => createImage({ file, name, alt: file.name.split('.')[0], collectionId })
        )
        if (!ret.success) return ret
        finalReturn = {
            ...finalReturn,
            success: ret.success,
        }
    }
    return finalReturn
}
