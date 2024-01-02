'use server'
import prisma from "@/prisma"
import type { ImageCollection, Image } from "@prisma/client"
import type { ActionReturn } from "@/actions/type"


export default async function read(id: number, amount: number, page: number)
    : Promise<ActionReturn<ImageCollection & {images: Image[]}>> {
    const collection = await prisma.imageCollection.findUnique({
        where: {
            id: id,
        },
        include: {
            images: {
                orderBy: {
                    id: 'asc'
                },
                skip: page * amount,
                take: amount,
            },
        },
    })
    if (!collection) return { success: false, error: [{ message: 'Image not found' }] }
    return { success: true, data: collection }
}