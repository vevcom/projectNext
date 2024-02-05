'use server';

import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import type { ActionReturn, ReadPageInput } from '@/actions/type'
import type { OmegaQuote } from '@prisma/client'

export type OmegaquoteFiltered = Pick<OmegaQuote, 'id' | 'author' | 'quote' | 'timestamp'>

export async function readPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
) : Promise<ActionReturn<OmegaquoteFiltered[]>> {
    try {
        const { page: pageNumber, pageSize } = page
        const results = await prisma.omegaQuote.findMany({
            orderBy: {
                timestamp: 'desc',
            },
            skip: pageNumber * pageSize,
            take: pageSize,
            select: {
                id: true,
                author: true,
                quote: true,
                timestamp: true,
            },
        })

        return { success: true, data: results }
    } catch (error) {
        return errorHandler(error)
    }
}