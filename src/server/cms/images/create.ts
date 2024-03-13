import 'server-only'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { Image, SpecialCmsImage } from '@prisma/client'
import type { ExpandedCmsImage } from './Types'
import type { ActionReturn } from '@/actions/Types'

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
): Promise<ActionReturn<ExpandedCmsImage>> {
    try {
        const created = await prisma.cmsImage.create({
            data: {
                name,
                special: data?.special,
                image: {
                    connect: {
                        id: image?.id
                    }
                }
            },
            include: {
                image: true
            }
        })
        return { success: true, data: created }
    } catch (error) {
        return createPrismaActionError(error)
    }
}