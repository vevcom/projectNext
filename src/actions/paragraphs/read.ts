'use server'
import create from './create'
import { ActionReturn } from '../type'
import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { Paragraph } from '@prisma/client'

export default async function read(name: string) : Promise<ActionReturn<Paragraph>> {
    try {
        const paragraph = await prisma.paragraph.findUnique({
            where: {
                name
            }
        })
        if (paragraph) {
            return {
                success: true,
                data: paragraph
            }
        }
        return create(name)
    } catch (error) {
        return errorHandeler(error)
    }
}
