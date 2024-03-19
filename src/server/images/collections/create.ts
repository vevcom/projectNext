import 'server-only'
import { createImageCollectionValidation } from './schema'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CreateImageCollectionType } from './schema'
import type { ImageCollection } from '@prisma/client'

export async function createImageCollection(
    rawdata: CreateImageCollectionType
): Promise<ImageCollection> {
    const data = createImageCollectionValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.imageCollection.create({ data }))
}

