import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { Prisma, Image } from '@prisma/client'
import { UpdateImageType, updateImageValidation } from './schema'

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
