import 'server-only'
import { updateImageValidation } from './validation'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { UpdateImageTypes } from './validation'
import type { Image } from '@prisma/client'

export async function updateImage(
    imageId: number,
    rawdata: UpdateImageTypes['Detailed']
): Promise<Image> {
    const data = updateImageValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.image.update({
        where: {
            id: imageId,
        },
        data
    }))
}
