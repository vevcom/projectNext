'use server'
import prisma from '@/prisma'
import type { Image, ImageLink } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'
import errorHandeler from '@/prisma/errorHandler'

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
            const created = {
                ...await prisma.imageLink.create({
                    data: {
                        name,
                    },
                }),
                image: null,
            }
            return { success: true, data: created }
        }
        return { success: true, data: imageLink }
    } catch (error) {
        return errorHandeler(error)
    }
}