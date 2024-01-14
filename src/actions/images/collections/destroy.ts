'use server'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'

export default async function destroy(collectionId: number): Promise<ActionReturn<ImageCollection>> {
    try {
        const collection = await prisma.imageCollection.delete({
            where: {
                id: collectionId,
            },
        })
        return { success: true, data: collection }
    } catch (error) {
        return errorHandeler(error)
    }
}
