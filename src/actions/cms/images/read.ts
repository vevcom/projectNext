'use server'
import create from './create'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { Image, CmsImage } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'

export default async function read(name: string) : Promise<ActionReturn<CmsImage & {image: Image | null}>> {
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
            return await create(name)
        }
        return { success: true, data: cmsImage }
    } catch (error) {
        return errorHandler(error)
    }
}
