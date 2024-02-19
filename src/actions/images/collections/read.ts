'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn, ReadPageInput } from '@/actions/type'
import type { ImageCollection, Image } from '@prisma/client'

export async function readImageCollection(id: number): Promise<ActionReturn<ImageCollection & {coverImage: Image | null}>> {
    try {
        const collection = await prisma.imageCollection.findUnique({
            where: {
                id,
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
