import '@pn-server-only'
import { createImageCollectionValidation } from './validation'
import { prisma } from '@/prisma/client'
import { prismaCall } from '@/services/prismaCall'
import { visibilityOperations } from '@/services/visibility/operations'
import type { CreateImageCollectionTypes } from './validation'
import type { ImageCollection } from '@prisma/client'

export async function createImageCollection(
    rawdata: CreateImageCollectionTypes['Detailed']
): Promise<ImageCollection> {
    const data = createImageCollectionValidation.detailedValidate(rawdata)
    const visibilityRead = await visibilityOperations.create({ bypassAuth: true })
    const visibilityAdmin = await visibilityOperations.create({ bypassAuth: true })

    return await prismaCall(() => prisma.imageCollection.create({
        data: {
            ...data,
            visibilityRead: {
                connect: {
                    id: visibilityRead.id
                }
            },
            visibilityAdmin: {
                connect: {
                    id: visibilityAdmin.id
                }
            }
        }
    }))
}

