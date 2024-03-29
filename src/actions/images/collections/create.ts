'use server'
import { createZodActionError } from '@/actions/error'
import { createImageCollection } from '@/server/images/collections/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createImageCollectionValidation } from '@/server/images/collections/validation'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { CreateImageCollectionTypes } from '@/server/images/collections/validation'

export async function createImageCollectionAction(
    rawdata: FormData | CreateImageCollectionTypes['Type']
): Promise<ActionReturn<ImageCollection>> {
    const parse = createImageCollectionValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    return await safeServerCall(() => createImageCollection(data))
}
