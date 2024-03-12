'use server'
import { readSpecialImageAction } from '@/actions/images/read'
import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import { SpecialCollection } from '@prisma/client'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { ImageCollection, Image } from '@prisma/client'
import { readSpecialImageCollection } from '@/server/images/collections/read'
import type { 
    ExpandedImageCollection, 
    ImageCollectionPageReturn 
} from '@/actions/images/collections/Types'

/**
 * Reads an image collection by id or name
 * @param idOrName - the id or name of the image collection
 * @returns the image collection in actionrturn
 */
export async function readImageCollection(
    idOrName: number | string
): Promise<ActionReturn<ExpandedImageCollection>> {
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
        if (!collection) return createActionError('NOT FOUND', 'Collection not found')
        return { success: true, data: collection }
    } catch (error) {
        return createPrismaActionError(error)
    }
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

        const lensCameraRes = await readSpecialImageAction('DEFAULT_IMAGE_COLLECTION_COVER')
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

/**
 * Reads a "special" collection read on this in the docs. If it does not exist it will create it.
 * @param special - the special collection to read
 * @returns the special collection
 */
export async function readSpecialImageCollectionAction(special: SpecialCollection): Promise<ActionReturn<ImageCollection>> {
    //Check that the collection actually is a special collection, as the paramter is only a compile time type check
    if (!Object.values(SpecialCollection).includes(special)) {
        return createActionError('BAD PARAMETERS', `${special} is not special`)
    }

    //TODO: Auth special image collections on permission (not visibility)
    //TODO: Check permission associated with the special collection
    return await readSpecialImageCollection(special)
}
