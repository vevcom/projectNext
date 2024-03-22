import 'server-only'
import { createImageCollectionValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CreateImageCollectionTypes } from './validation'
import type { ImageCollection } from '@prisma/client'

export async function createImageCollection(
    rawdata: CreateImageCollectionTypes['Detailed']
): Promise<ImageCollection> {
    const data = createImageCollectionValidation.detailedValidate(rawdata)
    return await prismaCall(() => prisma.imageCollection.create({ 
        data: {
            ...data,
            visibility: {
                create: {}
            }
        }
    }))
}

