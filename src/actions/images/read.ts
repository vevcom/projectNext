'use server'
import { readSpecialImageCollection } from './collections/read'
import { createActionError, createPrismaActionError } from '@/actions/error'
import prisma from '@/prisma'
import logger from '@/logger'
import { SpecialImage } from '@prisma/client'
import type { Image } from '@prisma/client'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { ImageDetails } from './Types'
import { readImagesPage } from '@/server/images/read'

export async function readImagesPageAction<const PageSize extends number>(
    pageReadInput: ReadPageInput<PageSize, ImageDetails>
): Promise<ActionReturn<Image[]>> {
    //TODO: auth route based on collection
    return await readImagesPage(pageReadInput)
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
    if (!Object.values(SpecialImage).includes(special)) {
        return createActionError('BAD PARAMETERS', `${special} is not special`)
    }

    try {
        const image = await prisma.image.findUnique({
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
