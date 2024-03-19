'use server'
import { safeServerCall } from '@/actions/safeServerCall'
import { createZodActionError } from '@/actions/error'
import { updateImage } from '@/server/images/update'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import { updateImageValidation } from '@/server/images/schema'
import type { UpdateImageType } from '@/server/images/schema'

export async function updateImageAction(
    imageId: number,
    rawdata: FormData | UpdateImageType
): Promise<ActionReturn<Image>> {
    const parse = updateImageValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    //TODO: auth the route

    return await safeServerCall(() => updateImage(imageId, data))
}
