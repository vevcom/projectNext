'use server'

import prisma from '@/prisma'
import { createActionError, createPrismaActionError } from '@/actions/error'
import { getUser } from '@/auth/user'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { OmegaquoteFiltered } from './Types'

export async function readQuotesPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<ActionReturn<OmegaquoteFiltered[]>> {
    // REFACTOR when new permission system is working
    const { status } = await getUser({
        requiredPermissions: ['OMEGAQUOTES_READ']
    })

    if (status !== 'AUTHORIZED') {
        return createActionError(status)
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
        return createPrismaActionError(error)
    }
}
