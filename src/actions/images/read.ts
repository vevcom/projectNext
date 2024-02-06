'use server'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { Image } from '@prisma/client'
import type { ActionReturn, ReadPageInput } from '@/actions/type'

export async function readImagePage<const PageSize extends number>(
    { page, details }: ReadPageInput<PageSize, {collectionId: number}>
) : Promise<ActionReturn<Image[]>> {
    const { collectionId } = details
    const { page: pageNumber, pageSize } = page
    try {
        const images = await prisma.image.findMany({
            where: {
                collectionId,
            },
            skip: pageNumber * pageSize,
            take: pageSize,
        })
        if (!images) return { success: false, error: [{ message: 'Image not found' }] }
        return { success: true, data: images }
    } catch (error) {
        return errorHandler(error)
    }
}


export async function readImageById(id: number) : Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.findUnique({
            where: {
                id,
            },
        })
        if (!image) return { success: false, error: [{ message: 'Image not found' }] }
        return { success: true, data: image }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function readImageByName(name: string) : Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.findUnique({
            where: {
                name,
            },
        })
        if (!image) return { success: false, error: [{ message: 'Image not found' }] }
        return { success: true, data: image }
    } catch (error) {
        return errorHandler(error)
    }
}

export async function readImage(nameOrId: string | number) : Promise<ActionReturn<Image>> {
    if (typeof nameOrId === 'number') return readImageById(nameOrId)
    return readImageByName(nameOrId)
}

