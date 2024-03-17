import 'server-only'
import prisma from '@/prisma'
import type { ImageCollection, Prisma } from '@prisma/client'
import { prismaCall } from '@/server/prismaCall'

export async function createImageCollection(
    data: Prisma.ImageCollectionCreateInput
): Promise<ImageCollection> {
    return await prismaCall(() => prisma.imageCollection.create({ data }))
}

