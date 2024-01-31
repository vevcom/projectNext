'use server'
import create from './create'
import { ActionReturn } from '@/actions/type'
import errorHandeler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { CmsParagraph } from '@prisma/client'

export default async function read(name: string) : Promise<ActionReturn<CmsParagraph>> {
    try {
        const paragraph = await prisma.cmsParagraph.findUnique({
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
