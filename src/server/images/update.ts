import 'server-only'
import prisma from '@/prisma'
import type { Prisma, Image } from '@prisma/client'
import { prismaCall } from '../prismaCall'

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
