'use server'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '../error'
import { SpecialImage } from '@prisma/client'
import type { Image } from '@prisma/client'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { ImageDetails } from './Types'
import logger from '@/logger'
import { readSpecialImageCollection } from './collections/read'

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

        if (!images) return createActionError('NOT FOUND', 'No images found')
        return { success: true, data: images }
    } catch (error) {
        return createPrismaActionError(error)
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

        if (!image) return createActionError('NOT FOUND', 'Image not found')
        return { success: true, data: image }
    } catch (error) {
        return createPrismaActionError(error)
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

        if (!image) return createActionError('NOT FOUND', 'Image not found')
        return { success: true, data: image }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

export async function readImage(nameOrId: string | number): Promise<ActionReturn<Image>> {
    if (typeof nameOrId === 'number') return readImageById(nameOrId)
    return readImageByName(nameOrId)
}

/**
 * Reads a "special" image - read on this in the docs. If it does not exist it will create it, but
 * its conntent will not be the intended content. This is NOT under any circomstainses supposed to happen
 * @param special - the special image to read
 * @returns the special image
 */
export async function readSpecialImage(special: SpecialImage): Promise<ActionReturn<Image>> {

    if (!Object.values(SpecialImage).includes(special)) createActionError('BAD PARAMETERS', `${special} is not special`)
    
    try {
        const image = await prisma.image.findFirst({
            where: {
                special,
            },
        })
        //TODO: auth image by collection

        if (!image) {
            const standardCollection = await readSpecialImageCollection('STANDARDIMAGES')
            if (!standardCollection.success) return standardCollection
            logger.error(`Special image ${special} did not exist, creating it with bad conent`)
            const newImage = await prisma.image.create({
                data: {
                    name: special,
                    special,
                    fsLocation: 'not_found',
                    fsLocationMediumSize: 'not_found',
                    fsLocationSmallSize: 'not_found',
                    ext: 'jpg',
                    alt: 'not found',
                    collection: {
                        connect: {
                            id: standardCollection.data.id
                        }
                    }
                },
            })
            return { success: true, data: newImage }
        }

        if (!image) return createActionError('NOT FOUND', 'Image not found')
        return { success: true, data: image }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
