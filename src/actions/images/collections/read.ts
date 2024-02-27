'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { ImageCollection, Image, SpecialCollection } from '@prisma/client'

export async function readImageCollection(
    idOrName: number | string
): Promise<ActionReturn<ImageCollection & {coverImage: Image | null}>> {
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

export async function readImageCollectionsPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<ActionReturn<ImageCollectionPageReturn[]>> {
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
    try {
        const collection = await prisma.imageCollection.findUnique({
            where: {
                special
            }
        })
        if (!collection) {
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
