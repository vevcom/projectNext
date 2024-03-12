import 'server-only'
import prisma from '@/prisma'
import { SpecialCollection } from '@prisma/client'
import type { ImageCollection } from '@prisma/client'
import logger from '@/logger'
import type { 
    ExpandedImageCollection, 
    ImageCollectionPageReturn 
} from '@/actions/images/collections/Types'
import { createActionError, createPrismaActionError } from '@/actions/error'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import { readSpecialImage } from '../read'
import type { Image } from '@prisma/client'


/**
 * Reads an image collection by id or name
 * @param idOrName - the id or name of the image collection
 * @returns the image collection in actionrturn
 */
export async function readImageCollection(
    idOrName: number | string
): Promise<ActionReturn<ExpandedImageCollection>> {
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
        if (!collection) return createActionError('NOT FOUND', 'Collection not found')
        return { success: true, data: collection }
    } catch (error) {
        return createPrismaActionError(error)
    }
}

/**
 * returns a page of image collections, orders by createdAt (and then name)
 * @param page - the page to read of the Page type
 * @returns - A page of image collections
 */
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
            orderBy: [
                { createdAt: 'desc' },
                { name: 'asc' }
            ],
            skip: pageNumber * pageSize,
            take: pageSize,
        })

        const lensCameraRes = await readSpecialImage('DEFAULT_IMAGE_COLLECTION_COVER')
        if (!lensCameraRes.success) return lensCameraRes
        const lensCamera = lensCameraRes.data

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
        return createPrismaActionError(error)
    }
}

export async function readSpecialImageCollection(special: SpecialCollection): Promise<ActionReturn<ImageCollection>> {
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
        return createPrismaActionError(error)
    }
}