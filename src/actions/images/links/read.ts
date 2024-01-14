'use server'
import prisma from '@/prisma'
import errorHandeler from '@/prisma/errorHandler'
import type { Image, ImageLink } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'
import create from './create'

export default async function read(name: string) : Promise<ActionReturn<ImageLink & {image: Image | null}>> {
    //Note this action reates a image link if it does not exist and returns it
    try {
        const imageLink = await prisma.imageLink.findUnique({
            where: {
                name,
            },
            include: {
                image: true,
            }
        })
        if (!imageLink) {
            return await create(name)
        }
        return { success: true, data: imageLink }
    } catch (error) {
        return errorHandeler(error)
    }
}
