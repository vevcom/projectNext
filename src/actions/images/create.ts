'use server'
import { createImageSchema, createImagesSchema } from './schema'
import { createZodActionError, createPrismaActionError, createActionError } from '@/actions/error'
import type { CreateImageSchemaType, CreateImagesSchemaType } from './schema'
import type { ActionReturn } from '@/actions/Types'
import type { Image } from '@prisma/client'
import { createImage } from '@/server/images/create'

export async function createImageAction(
    collectionId: number,
    rawdata: FormData | CreateImageSchemaType
): Promise<ActionReturn<Image>> {
    const parse = createImageSchema.safeParse(rawdata)
    if (!parse.success) return createZodActionError(parse)
    const { file, ...data } = parse.data

    return await createImage(file, { ...data, collectionId })
}

export async function createImagesAction(
    collectionId: number,
    rawdata: FormData | CreateImagesSchemaType
): Promise<ActionReturn<Image[]>> {
    const parse = createImagesSchema.safeParse(rawdata)

    if (!parse.success) return createZodActionError(parse)

    const data = parse.data

    let finalReturn: ActionReturn<Image[]> = { success: true, data: [] }
    for (const file of data.files) {
        const ret = await createImage(file, { name: file.name.split('.')[0], alt: file.name.split('.')[0], collectionId })
        if (!ret.success) return ret
        finalReturn = {
            ...finalReturn,
            success: ret.success,
        }
        finalReturn.data.push(ret.data)
    }
    return finalReturn
}
