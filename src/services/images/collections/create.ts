import '@pn-server-only'
import { createImageCollectionValidation } from './validation'
import { prisma } from '@/prisma/client'
import { prismaCall } from '@/services/prismaCall'
import { createVisibility } from '@/services/visibility/create'
import type { CreateImageCollectionTypes } from './validation'
import type { ImageCollection } from '@prisma/client'

export async function createImageCollection(
    rawdata: CreateImageCollectionTypes['Detailed']
): Promise<ImageCollection> {
    const data = createImageCollectionValidation.detailedValidate(rawdata)
    const visivility = await createVisibility('IMAGE')
    return await prismaCall(() => prisma.imageCollection.create({
        data: {
            ...data,
            visibility: {
                connect: {
                    id: visivility.id
                }
            }
        }
    }))
}

