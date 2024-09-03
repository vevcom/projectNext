'use server'
import { createActionError, createZodActionError } from '@/actions/error'
import { createImageCollection } from '@/services/images/collections/create'
import { safeServerCall } from '@/actions/safeServerCall'
import { createImageCollectionValidation } from '@/services/images/collections/validation'
import { getUser } from '@/auth/getUser'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { CreateImageCollectionTypes } from '@/services/images/collections/validation'

export async function createImageCollectionAction(
    rawdata: FormData | CreateImageCollectionTypes['Type']
): Promise<ActionReturn<ImageCollection>> {
    const { authorized, status } = await getUser({
        requiredPermissions: [['IMAGE_COLLECTION_CREATE']]
    })
    if (!authorized) return createActionError(status)

    const parse = createImageCollectionValidation.typeValidate(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    return await safeServerCall(() => createImageCollection(data))
}
