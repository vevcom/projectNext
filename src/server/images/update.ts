import 'server-only'
import { updateImageValidation } from './schema'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { UpdateImageType } from './schema'
import type { Image } from '@prisma/client'

export async function updateImage(
    imageId: number,
    rawdata: UpdateImageType
): Promise<Image> {
    const data = updateImageValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.image.update({
        where: {
            id: imageId,
        },
        data
    }))
}
