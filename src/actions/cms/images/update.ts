'use server'
import { ActionReturn } from '@/actions/type'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'
import type { CmsImage, ImageSize } from '@prisma/client'

export default async function update(linkId: number, imageId: number) : Promise<ActionReturn<CmsImage>> {
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
        return errorHandeler(error)
    }
}

export async function updateConfig(linkId: number, config: {imageSize: ImageSize}): Promise<ActionReturn<CmsImage>> {
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
        return errorHandeler(error)
    }
}
