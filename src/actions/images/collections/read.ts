'use server'
import prisma from "@/prisma"
import type { ImageCollection, Image } from "@prisma/client"
import type { ActionReturn, Page } from "@/actions/type"

export default async function read<const PageSize extends number>(id: number, {pageSize, page}: Page<PageSize>)
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
                skip: page * pageSize,
                take: pageSize,
            },
        },
    })
    if (!collection) return { success: false, error: [{ message: 'Image not found' }] }
    return { success: true, data: collection }
}