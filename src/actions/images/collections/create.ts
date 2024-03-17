'use server'
import { createImageCollectionSchema } from './schema'
import { createZodActionError } from '@/actions/error'
import { createImageCollection } from '@/server/images/collections/create'
import { safeServerCall } from '@/actions/safeServerCall'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { CreateImageCollectionSchemaType } from './schema'

export async function createImageCollectionAction(
    rawdata: FormData | CreateImageCollectionSchemaType
): Promise<ActionReturn<ImageCollection>> {
    const parse = createImageCollectionSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data
    return await safeServerCall(() => createImageCollection(data))
}
