'use server'
import { ActionReturn } from '@/actions/type'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'
import { ImageLink } from '@prisma/client'

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
