import type { ActionReturn, ReadPageInput } from '@/actions/type'
import type { ImageCollection, Image } from '@prisma/client'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'

export default async function read(id: number) : Promise<ActionReturn<ImageCollection & {coverImage: Image | null}>> {
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
        return errorHandeler(error)
    }
}


type Return = ImageCollection & {
    coverImage: Image | null,
    backupImage: Image | null,
    numberOfImages: number,
}
export async function readPage<const PageSize extends number>
({page, details}: ReadPageInput<PageSize, {}>) : Promise<ActionReturn<Return[]>> {
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
        return { success: true, data: collections.map(collection => ({
            ...collection,
            numberOfImages: collection._count.images,
            backupImage: collection.images[0] ?? null,
        }))}
    } catch (error) {
        return errorHandeler(error)
    }
}
