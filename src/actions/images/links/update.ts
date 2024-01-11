'use server'
import { ActionReturn } from '@/actions/type'
import { ImageLink } from '@prisma/client'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'

export default async function update(linkId: number, imageId: number) : Promise<ActionReturn<ImageLink>> {
    try {
        const imageLink = await prisma.imageLink.update({
            where: {
                id: linkId,
            },
            data: {
                image: {
                    connect: {
                        id: imageId,
                    }
                }
            }
        })
        return { success: true, data: imageLink }
    } catch (error) {
        return errorHandeler(error)
    }
}
