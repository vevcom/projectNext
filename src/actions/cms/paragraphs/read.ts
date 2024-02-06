'use server'
import { createCmsParagraph } from './create'
import { ActionReturn } from '@/actions/type'
import errorHandler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import { CmsParagraph } from '@prisma/client'

export async function readCmsParagraph(name: string) : Promise<ActionReturn<CmsParagraph>> {
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
        return createCmsParagraph(name)
    } catch (error) {
        return errorHandler(error)
    }
}
