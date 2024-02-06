'use server'
import { ActionReturn } from '@/actions/type'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { CmsImage, ImageSize } from '@prisma/client'

export async function updateCmsImage(linkId: number, imageId: number) : Promise<ActionReturn<CmsImage>> {
    try {
        const cmsImage = await prisma.cmsImage.update({
            where: {
                id: linkId,
            },
            data: {
                image: {
                    connect: {
                        id: imageId,
                    }
                }
            }
        })
        return { success: true, data: cmsImage }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function updateCmsImageConfig(linkId: number, config: {imageSize: ImageSize}): Promise<ActionReturn<CmsImage>> {
    try {
        const cmsImage = await prisma.cmsImage.update({
            where: {
                id: linkId,
            },
            data: {
                ...config
            }
        })
        return { success: true, data: cmsImage }
    } catch (error) {
        return errorHandler(error)
    }
}
