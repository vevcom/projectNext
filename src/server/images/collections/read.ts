import 'server-only'
import { readSpecialImage } from '@/server/images/read'
import prisma from '@/prisma'
import logger from '@/logger'
import { prismaCall } from '@/server/prismaCall'
import { ServerError } from '@/server/error'
import type { SpecialCollection, ImageCollection, Image } from '@prisma/client'
import type {
    ExpandedImageCollection,
    ImageCollectionPageReturn
} from '@/server/images/collections/Types'
import type { ReadPageInput } from '@/actions/Types'


/**
 * Reads an image collection by id or name
 * @param idOrName - the id or name of the image collection
 * @returns the image collection in actionrturn
 */
export async function readImageCollection(
    idOrName: number | string
): Promise<ExpandedImageCollection> {
    const collection = await prismaCall(() => prisma.imageCollection.findUnique({
        where: typeof idOrName === 'number' ? {
            id: idOrName,
        } : {
            name: idOrName,
        },
        include: {
            coverImage: true,
        }
    }))
    if (!collection) throw new ServerError('NOT FOUND', 'Collection not found')
    return collection
}

/**
 * returns a page of image collections, orders by createdAt (and then name)
 * @param page - the page to read of the Page type
 * @returns - A page of image collections
 */
export async function readImageCollectionsPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<ImageCollectionPageReturn[]> {
    const { page: pageNumber, pageSize } = page
    const collections = await prismaCall(() => prisma.imageCollection.findMany({
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
    }))

    const lensCamera = await readSpecialImage('DEFAULT_IMAGE_COLLECTION_COVER')

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

    return returnData
}

export async function readSpecialImageCollection(special: SpecialCollection): Promise<ImageCollection> {
    const collection = await prismaCall(() => prisma.imageCollection.findUnique({
        where: {
            special
        }
    }))
    if (!collection) {
        logger.warn(`Special collection ${special} did not exist, creating it`)
        const newCollection = await prismaCall(() => prisma.imageCollection.create({
            data: {
                name: special,
                special,
                visibility: {
                    create: {} //TODO: Look in a config obj. to see which permission to link to
                }
            }
        }))
        return newCollection
    }
    return collection
}
