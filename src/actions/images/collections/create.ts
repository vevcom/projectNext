'use server'
import { createZodActionError } from '@/actions/error'
import { createImageCollection } from '@/server/images/collections/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createImageCollectionValidation } from '@/server/images/collections/schema'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { CreateImageCollectionType } from '@/server/images/collections/schema'

export async function createImageCollectionAction(
    rawdata: FormData | CreateImageCollectionType
): Promise<ActionReturn<ImageCollection>> {
    const parse = createImageCollectionValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    return await safeServerCall(() => createImageCollection(data))
}
