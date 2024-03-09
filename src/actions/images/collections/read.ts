'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import logger from '@/logger'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { ImageCollection, Image, SpecialCollection } from '@prisma/client'

/**
 * Reads an image collection by id or name
 * @param idOrName - the id or name of the image collection
 * @returns the image collection in actionrturn
 */
export async function readImageCollection(
    idOrName: number | string
): Promise<ActionReturn<ImageCollection & {coverImage: Image | null}>> {
    //TODO: Auth image collections on visibility or permission (if special collection)
    try {
        const collection = await prisma.imageCollection.findUnique({
            where: typeof idOrName === 'number' ? {
                id: idOrName,
            } : {
                name: idOrName,
            },
            include: {
                coverImage: true,
            }
        })
        if (!collection) return { success: false, error: [{ message: 'Collection not found' }] }
        return { success: true, data: collection }
    } catch (error) {
        return errorHandler(error)
    }
}

export type ImageCollectionPageReturn = ImageCollection & {
    coverImage: Image | null,
    numberOfImages: number,
}

/**
 * Returns a page of image collections, orders by createdAt (and then name)
 * @param page - the page to read of the Page type
 * @returns
 */
export async function readImageCollectionsPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<ActionReturn<ImageCollectionPageReturn[]>> {
    //TODO: Auth image collections on visibility or permission (if special collection)
    try {
        const { page: pageNumber, pageSize } = page
        const collections = await prisma.imageCollection.findMany({
            include: {
                coverImage: true,
                images: {
                    take: 1
                },
                _count: {
                    select: {
                        images: true
                    }
                }
            },
            orderBy: [
                { createdAt: 'desc' },
                { name: 'asc' }
            ],
            skip: pageNumber * pageSize,
            take: pageSize,
        })

        const lensCamera = await prisma.image.findUnique({
            where: {
                name: 'lens_camera'
            },
        })

        const chooseCoverImage = (collection: {
            coverImage: Image | null,
            images: Image[]
        }) => {
            if (collection.coverImage) return collection.coverImage
            if (collection.images[0]) return collection.images[0]
            if (lensCamera) return lensCamera
            return null
        }
        const returnData = collections.map(collection => ({
            ...collection,
            coverImage: chooseCoverImage(collection),
            numberOfImages: collection._count.images,
        }))

        return { success: true, data: returnData }
    } catch (error) {
        return errorHandler(error)
    }
}

/**
 * Reads a "special" collection read on this in the docs. If it does not exist it will create it.
 * @param special the special collection to read
 * @returns the special collection
 */
export async function readSpecialImageCollection(special: SpecialCollection): Promise<ActionReturn<ImageCollection>> {
    //TODO: Auth special image collections on permission (not visibility)
    //TODO: Check permission associated with the special collection
    try {
        const collection = await prisma.imageCollection.findUnique({
            where: {
                special
            }
        })
        if (!collection) {
            logger.warn(`Special collection ${special} did not exist, creating it`)
            const newCollection = await prisma.imageCollection.create({
                data: {
                    name: special,
                    special
                }
            })
            return { success: true, data: newCollection }
        }
        return { success: true, data: collection }
    } catch (error) {
        return errorHandler(error)
    }
}
