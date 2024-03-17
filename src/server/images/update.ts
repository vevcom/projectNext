import 'server-only'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { Prisma, Image } from '@prisma/client'

export async function updateImage(
    imageId: number,
    data: Prisma.ImageUpdateInput
): Promise<Image> {
    return await prismaCall(() => prisma.image.update({
        where: {
            id: imageId,
        },
        data
    }))
}
