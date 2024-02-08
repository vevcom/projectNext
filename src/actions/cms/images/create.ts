'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { Image, CmsImage } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'

export async function createCmsImage(name: string): Promise<ActionReturn<CmsImage & {image: Image | null}>> {
    try {
        const created = {
            ...await prisma.cmsImage.create({
                data: {
                    name,
                },
            }),
            image: null,
        }
        return { success: true, data: created }
    } catch (error) {
        return errorHandler(error)
    }
}
