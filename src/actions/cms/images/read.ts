'use server'
import { createCmsImage } from './create'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ExpandedCmsImage } from './Types'
import type { ActionReturn } from '@/actions/Types'
import { SpecialCmsImage } from '@prisma/client'

/**
 * Read a cms image including the image
 * @param name - name of the cms image the image
 * @returns 
 */
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
        if (!cmsImage) return { success: false, error: [{ message: `CmsImage ${name} not found` }] }
        return { success: true, data: cmsImage }
    } catch (error) {
        return errorHandler(error)
    }
}

/**
 * Reads a special cmsImage, if it does not exist it creates it
 * @param special SpecialCmsImage
 * @returns ActionReturn<ExpandedCmsImage>
 */
export async function readSpecialCmsImage(special: SpecialCmsImage): Promise<ActionReturn<ExpandedCmsImage>> {
    if (!Object.values(SpecialCmsImage).includes(special)) return {
        success: false,
        error: [{ message: `${special} is not special` }]
    }
    try {
        const cmsImage = await prisma.cmsImage.findUnique({
            where: {
                name: special,
            },
            include: {
                image: true,
            }
        })
        if (!cmsImage) {
            const created = await prisma.cmsImage.create({
                data: {
                    name: special,
                    special: special,
                },
                include: {
                    image: true
                }
            })
            return { success: true, data: created }
        }
        return { success: true, data: cmsImage }
    } catch (error) {
        return errorHandler(error)
    }
}
