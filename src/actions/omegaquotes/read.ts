'use server'

import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { getUser } from '@/auth'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { OmegaquoteFiltered } from './Types'

export async function readQuotesPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<ActionReturn<OmegaquoteFiltered[]>> {
    // REFACTOR when new permission system is working
    const { user, status } = await getUser({
        permissions: ['OMEGAQUOTES_READ']
    })

    if (!user) {
        return {
            success: false,
            error: [{
                message: status
            }]
        }
    }

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
