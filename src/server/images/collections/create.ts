import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { ImageCollection } from '@prisma/client'
import { CreateImageCollectionType, createImageCollectionValidation } from './schema'

export async function createImageCollection(
    rawdata: CreateImageCollectionType
): Promise<ImageCollection> {
    const data = createImageCollectionValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.imageCollection.create({ data }))
}

