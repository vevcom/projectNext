import 'server-only'
import prisma from '@/prisma'
import { prismaCall } from '@/server/prismaCall'
import type { Image, SpecialCmsImage } from '@prisma/client'
import type { ExpandedCmsImage } from './Types'

/**
 * A function to create a cmsImage
 * @param name - The name of the cmsImage to create
 * @param data - The data to associate with the cmsImage
 * @param image - The image to associate with the cmsImage
 * @returns - The created cmsImage
 */
export async function createCmsImage(
    name: string,
    data?: {
        special?: SpecialCmsImage
    },
    image?: Image
): Promise<ExpandedCmsImage> {
    return await prismaCall(() => prisma.cmsImage.create({
        data: {
            name,
            special: data?.special,
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
