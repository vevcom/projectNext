'use server'

import { readPermissionsOfUser } from '@/actions/permissions/read'
import prisma from '@/prisma'
import errorHandler from '@/prisma/errorHandler'
import { getUser } from '@/auth'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { OmegaquoteFiltered } from './Types'

export async function readQuotesPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<ActionReturn<OmegaquoteFiltered[]>> {
    // REFACTOR when new permission system is working
    const user = await getUser()

    if (!user) {
        return {
            success: false,
            error: [{
                message: '403: Not authenticated'
            }]
        }
    }

    const permissions = await readPermissionsOfUser(user.id)
    if (!permissions.success) {
        return {
            success: false,
            error: [{
                message: '500: Failed to read permissions of user'
            }]
        }
    }

    if (!permissions.data.has('OMEGAQUOTES_READ')) {
        return {
            success: false,
            error: [{
                message: '403: User not allowed to add quotes'
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
