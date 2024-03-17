import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { ImageCollection, Prisma } from '@prisma/client'

export async function createImageCollection(
    data: Prisma.ImageCollectionCreateInput
): Promise<ImageCollection> {
    return await prismaCall(() => prisma.imageCollection.create({ data }))
}

