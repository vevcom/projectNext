'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ExpandedCmsImage } from './Types'
import type { Image } from '@prisma/client'
import type { ActionReturn } from '@/actions/Types'

export async function createCmsImage(name: string, image?: Image): Promise<ActionReturn<ExpandedCmsImage>> {
    try {
        const created = await prisma.cmsImage.create({
            data: {
                name,
                imageId: image?.id
            },
            include: {
                image: true
            }
        })
        return { success: true, data: created }
    } catch (error) {
        return errorHandler(error)
    }
}
