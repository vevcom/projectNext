import 'server-only'
import { omegaQuoteFilterSelection } from './CofigVars'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ReadPageInput } from '@/actions/Types'
import type { OmegaquoteCursor, OmegaquoteFiltered } from '@/server/omegaquotes/Types'

export async function readQuotesPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize, OmegaquoteCursor>
): Promise<OmegaquoteFiltered[]> {
    const { cursor, pageSize } = page
    return await prismaCall(() => prisma.omegaQuote.findMany({
        orderBy: {
            timestamp: 'desc',
        },
        cursor,
        take: pageSize,
        select: omegaQuoteFilterSelection,
    }))
}
