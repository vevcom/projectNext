import 'server-only'
import { omegaQuoteFilterSelection } from './CofigVars'
import prisma from '@/prisma'
import type { ReadPageInput } from '@/actions/Types'
import type { OmegaquoteFiltered } from '@/server/omegaquotes/Types'
import { prismaCall } from '../prismaCall'

export async function readQuotesPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize>
): Promise<OmegaquoteFiltered[]> {
    const { page: pageNumber, pageSize } = page
    return await prismaCall(() => prisma.omegaQuote.findMany({
        orderBy: {
            timestamp: 'desc',
        },
        skip: pageNumber * pageSize,
        take: pageSize,
        select: omegaQuoteFilterSelection,
    }))
}
