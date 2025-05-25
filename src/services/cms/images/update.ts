import '@pn-server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/services/prismaCall'
import type { CmsImage, ImageSize } from '@prisma/client'

/**
 * A function that changes the image of a cms image
 * @param cmImageId - The id of the cms image to change image
 * @param imageId - The id of the image to connect
 * @returns
 */
export async function updateCmsImage(cmImageId: number, imageId: number): Promise<CmsImage> {
    return await prismaCall(() => prisma.cmsImage.update({
        where: {
            id: cmImageId,
        },
        data: {
            image: {
                connect: {
                    id: imageId,
                }
            }
        }
    }))
}

/**
 * A function to update metadata of a cms image
 * @param cmsImageId - The id of the cms image to update
 * @param config - The new config
 * @returns
 */
export async function updateCmsImageConfig(
    cmsImageId: number,
    config: {imageSize: ImageSize}
): Promise<CmsImage> {
    return await prismaCall(() => prisma.cmsImage.update({
        where: {
            id: cmsImageId,
        },
        data: {
            ...config
        }
    }))
}
