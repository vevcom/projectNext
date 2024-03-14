import 'server-only'
import prisma from '@/prisma'
import { createPrismaActionError, createZodActionError } from '@/actions/error'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'
import type { Prisma } from '@prisma/client';

export async function createImageCollection(
    data: Prisma.ImageCollectionCreateInput
): Promise<ActionReturn<ImageCollection>> {
    try {
        const collection = await prisma.imageCollection.create({ data })
        return { success: true, data: collection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}


