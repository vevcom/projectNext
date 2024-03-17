'use server'
import { updateImageSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import { updateImage } from '@/server/images/update'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateImageSchemaType } from './schema'
import { safeServerCall } from '../safeServerCall'

export async function updateImageAction(
    imageId: number,
    rawdata: FormData | UpdateImageSchemaType
): Promise<ActionReturn<Image>> {
    const parse = updateImageSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    //TODO: auth the route

    return await safeServerCall(() => updateImage(imageId, data))
}
