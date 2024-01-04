import type { ActionReturn } from '@/actions/type'
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
