'use server'
import { createCmsImage } from './create'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ExpandedCmsImage } from './Types'
import type { ActionReturn } from '@/actions/Types'

export async function readCmsImage(name: string): Promise<ActionReturn<ExpandedCmsImage>> {
    //Note this action reates a image link if it does not exist and returns it
    try {
        const cmsImage = await prisma.cmsImage.findUnique({
            where: {
                name,
            },
            include: {
                image: true,
            }
        })
        if (!cmsImage) {
            return await createCmsImage(name)
        }
        return { success: true, data: cmsImage }
    } catch (error) {
        return errorHandler(error)
    }
}
