import 'server-only'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import { SpecialCmsImage } from '@prisma/client'
import type { ExpandedCmsImage } from '@/cms/images/Types'
import type { ActionReturn } from '@/actions/Types'
import { createCmsImage } from '@/server/cms/images/create'

/**
 * Read a cms image including the image associated with it
 * @param name - name of the cms image the image
 * @returns - The cms image
 */
export async function readCmsImage(name: string): Promise<ActionReturn<ExpandedCmsImage>> {
    try {
        const cmsImage = await prisma.cmsImage.findUnique({
            where: {
                name,
            },
            include: {
                image: true,
            }
        })
        if (!cmsImage) return createActionError('NOT FOUND', `${name} Cms Image not found`)
        return { success: true, data: cmsImage }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

/**
 * WARNING: You should assure that the special atr. is Special before calling this function
 * Reads a special cmsImage.
 * @param special SpecialCmsImage
 * @returns ActionReturn<ExpandedCmsImage>
 */
export async function readSpecialCmsImage(special: SpecialCmsImage): Promise<ActionReturn<ExpandedCmsImage>> {
    try {
        const cmsImage = await prisma.cmsImage.findUnique({
            where: {
                special,
            },
            include: {
                image: true,
            }
        })
        if (!cmsImage) return createActionError('NOT FOUND', `${special} Cms Image not found`)
        return { success: true, data: cmsImage }
    } catch (error) {
        return createPrismaActionError(error)
    }
}