import 'server-only'
import { omegaQuoteFilterSelection } from './CofigVars'
import prisma from '@/prisma'
import { createPrismaActionError } from '@/actions/error'
import type { ActionReturn, ReadPageInput } from '@/actions/Types'
import type { OmegaquoteFiltered } from '@/server/omegaquotes/Types'

export async function readQuotesPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<ActionReturn<OmegaquoteFiltered[]>> {
    const { page: pageNumber, pageSize } = page
    try {
        const results = await prisma.omegaQuote.findMany({
            orderBy: {
                timestamp: 'desc',
            },
            skip: pageNumber * pageSize,
            take: pageSize,
            select: omegaQuoteFilterSelection,
        })

        return { success: true, data: results }
    } catch (error) {
        return createPrismaActionError(error)
    }
}
