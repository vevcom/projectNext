import prisma from '@/prisma'
import type { Image, ImageLink } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'
import errorHandeler from '@/prisma/errorHandler'

export default async function create(name: string) : Promise<ActionReturn<ImageLink & {image: Image | null}>> {
    try {
        const created = {
            ...await prisma.imageLink.create({
                data: {
                    name,
                },
            }),
            image: null,
        }
        return { success: true, data: created }
    } catch (error) {
        return errorHandeler(error)
    }
}