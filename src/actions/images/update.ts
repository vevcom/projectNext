'use server'
import { updateImageSchema } from './schema'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { UpdateImageSchemaType } from './schema'

export async function updateImage(imageId: number, rawdata: FormData | UpdateImageSchemaType): Promise<ActionReturn<Image>> {
    const parse = updateImageSchema.safeParse(rawdata)
    if (!parse.success) return { success: false, error: parse.error.issues }
    const data = parse.data
    try {
        const image = await prisma.image.update({
            where: {
                id: imageId,
            },
            data
        })
        return { success: true, data: image }
    } catch (error) {
        return errorHandler(error)
    }
}
