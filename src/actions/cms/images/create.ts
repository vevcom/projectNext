'use server'
import { createCmsImageActionSchema } from './schema'
import { safeServerCall } from '@/actions/safeServerCall'
import { createCmsImage } from '@/server/cms/images/create'
import { createZodActionError } from '@/actions/error'
import type { CreateCmsImageActionType } from './schema'
import type { Image } from '@prisma/client'
import type { ExpandedCmsImage } from '@/server/cms/images/Types'
import type { ActionReturn } from '@/actions/Types'

export async function createCmsImageAction(
    rawData: FormData | CreateCmsImageActionType,
    image?: Image,
): Promise<ActionReturn<ExpandedCmsImage>> {
    //TODO: Auth route (very few people should be able to create stand alone cmsImages...)
    const parse = createCmsImageActionSchema.typeValidate(rawData)
    if (!parse.success) return createZodActionError(parse)
    const data = parse.data

    return await safeServerCall(() => createCmsImage(data, image))
}
