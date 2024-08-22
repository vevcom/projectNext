'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { updateImage } from '@/server/images/update'
import { updateImageValidation } from '@/server/images/validation'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateImageTypes } from '@/server/images/validation'

export async function updateImageAction(
    imageId: number,
    rawdata: FormData | UpdateImageTypes['Type']
): Promise<ActionReturn<Image>> {
    const parse = updateImageValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    //TODO: auth the route

    return await safeServerCall(() => updateImage(imageId, data))
}
