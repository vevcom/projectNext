'use server'
import prisma from '@/prisma'
import type { ImageCollection, Image } from '@prisma/client'
import type { ActionReturn, ReadPageInput } from '@/actions/type'
import errorHandeler from '@/prisma/errorHandler'

export async function readPage<const PageSize extends number>({ page, details }: ReadPageInput<PageSize, {id: number}>)
    : Promise<ActionReturn<ImageCollection & {images: Image[]}>> {
    const { id } = details
    const { page: pageNumber, pageSize } = page
    const collection = await prisma.imageCollection.findUnique({
        where: {
            id,
        },
        include: {
            images: {
                orderBy: {
                    id: 'asc'
                },
                skip: pageNumber * pageSize,
                take: pageSize,
            },
        },
    })
    if (!collection) return { success: false, error: [{ message: 'Image not found' }] }
    return { success: true, data: collection }
}

export default async function read(nameOrId: string | number) : Promise<ActionReturn<Image>> {
    if (typeof nameOrId === 'number') return readById(nameOrId)
    return readByName(nameOrId)
}

export async function readById(id: number) : Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.findUnique({
            where: {
                id,
            },
        })
        if (!image) return { success: false, error: [{ message: 'Image not found' }] }
        return { success: true, data: image }
    } catch (error) {
        return errorHandeler(error)
    }
}

export async function readByName(name: string) : Promise<ActionReturn<Image>> {
    try {
        const image = await prisma.image.findUnique({
            where: {
                name,
            },
        })
        if (!image) return { success: false, error: [{ message: 'Image not found' }] }
        return { success: true, data: image }
    } catch (error) {
        return errorHandeler(error)
    }
}
