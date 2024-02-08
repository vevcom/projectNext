'use server'
import { createCmsParagraph } from './create'
import errorHandler from '@/prisma/errorHandler'
import prisma from '@/prisma'
import type { ActionReturn } from '@/actions/type'
import type { CmsParagraph } from '@prisma/client'

export default async function read(name: string): Promise<ActionReturn<CmsParagraph>> {
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
