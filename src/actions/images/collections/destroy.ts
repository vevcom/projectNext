'use server'
import type { ImageCollection } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'

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