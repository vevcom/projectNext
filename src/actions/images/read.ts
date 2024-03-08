'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { SpecialImage } from '@prisma/client'
import type { Image } from '@prisma/client'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { ImageDetails } from './Types'

export async function readImagesPage<const PageSize extends number>(
    { page, details }: ReadPageInput<PageSize, ImageDetails>
): Promise<ActionReturn<Image[]>> {
    const { collectionId } = details
    const { page: pageNumber, pageSize } = page
    try {
        const images = await prisma.image.findMany({
            where: {
                collectionId,
            },
            skip: pageNumber * pageSize,
            take: pageSize,
        })
        //TODO: auth image by collection

        if (!images) return { success: false, error: [{ message: 'Image not found' }] }
        return { success: true, data: images }
    } catch (error) {
        return errorHandler(error)
    }
}


export async function readImageById(id: number): Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.findUnique({
            where: {
                id,
            },
        })
        //TODO: auth image by collection

        if (!image) return { success: false, error: [{ message: 'Image not found' }] }
        return { success: true, data: image }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function readImageByName(name: string): Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.findUnique({
            where: {
                name,
            },
        })
        //TODO: auth image by collection

        if (!image) return { success: false, error: [{ message: 'Image not found' }] }
        return { success: true, data: image }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function readImage(nameOrId: string | number): Promise<ActionReturn<Image>> {
    if (typeof nameOrId === 'number') return readImageById(nameOrId)
    return readImageByName(nameOrId)
}

/**
 * Reads a "special" image - read on this in the docs. If it does not exist it will create it.
 * @param special - the special image to read
 * @returns the special image
 */
export async function readSpecialImage(special: SpecialImage): Promise<ActionReturn<Image>> {

    if (!Object.values(SpecialImage).includes(special)) return {
        success: false,
        error: [{ message: `${special} is not special` }]
    }
    
    try {
        const image = await prisma.image.findFirst({
            where: {
                special,
            },
        })
        //TODO: auth image by collection

        if (!image) {
            
        }
        if (!image) return { success: false, error: [{ message: 'Image not found' }] }
        return { success: true, data: image }
    } catch (error) {
        return errorHandler(error)
    }
}
