'use server'
import prisma from '@/prisma'
import type { Paragraph } from '@prisma/client'
import type { ActionReturn } from '@/actions/type'
import errorHandeler from '@/prisma/errorHandler'

export default async function create(name: string) : Promise<ActionReturn<Paragraph>> {
    try {
        const created = await prisma.paragraph.create({
            data: {
                name,
            },
        })
        return { success: true, data: created }
    } catch (error) {
        return errorHandeler(error)
    }
}