'use server'
import prisma from '@/prisma'
import type { ImageLink } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'
import errorHandeler from '@/prisma/errorHandler'

export default async function read(name: string) : Promise<ActionReturn<ImageLink>> {
    try {
        const imageLink = await prisma.imageLink.findUnique({
            where: {
                name,
            },
            include: {
                image: true,
            }
        })
        if (!imageLink) return { success: false, error: [{ message: 'Image not found' }] }
        return { success: true, data: imageLink }
    } catch (error) {
        return errorHandeler(error)
    }
}