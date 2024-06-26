import 'server-only'
import { omegaQuoteFilterSelection } from './CofigVars'
import { cursorPageingSelection } from '@/server/paging/cursorPageingSelection'
import { prismaCall } from '@/server/prismaCall'
import prisma from '@/prisma'
import type { ReadPageInput } from '@/server/paging/Types'
import type { OmegaquoteCursor, OmegaquoteFiltered } from '@/server/omegaquotes/Types'

export async function readQuotesPage<const PageSize extends number>(
    { page }: ReadPageInput<PageSize, OmegaquoteCursor>
): Promise<OmegaquoteFiltered[]> {
    return await prismaCall(() => prisma.omegaQuote.findMany({
        orderBy: {
            timestamp: 'desc',
        },
        ...cursorPageingSelection(page),
        select: omegaQuoteFilterSelection,
    }))
}
