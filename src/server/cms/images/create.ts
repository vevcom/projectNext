import 'server-only'
import { createCmsImageSchema } from './schema'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { CreateCmsImageType } from './schema'
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
    rawData: CreateCmsImageType,
    image?: Image,
): Promise<ExpandedCmsImage> {
    const data = createCmsImageSchema.detailedValidate(rawData)

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
