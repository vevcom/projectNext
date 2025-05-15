import '@pn-server-only'
import { createCmsImageValidation } from './validation'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { CreateCmsImageTypes } from './validation'
import type { Image } from '@prisma/client'
import type { ExpandedCmsImage } from './Types'

/**
 * A function to create a cmsImage
 * @param name - The name of the cmsImage to create
 * @param data - The data to associate with the cmsImage
 * @param image - The image to associate with the cmsImage
 * @returns - The created cmsImage
 */
export async function createCmsImage(
    rawData: CreateCmsImageTypes['Detailed'],
    image?: Image,
): Promise<ExpandedCmsImage> {
    const data = createCmsImageValidation.detailedValidate(rawData)

    return await prismaCall(() => prisma.cmsImage.create({
        data: {
            ...data,
            image: image ? {
                connect: {
                    id: image?.id
                }
            } : undefined
        },
        include: {
            image: true
        }
    }))
}
