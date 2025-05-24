import '@pn-server-only'
import { omegaQuoteFilterSelection } from './CofigVars'
import { cursorPageingSelection } from '@/lib/paging/cursorPageingSelection'
import { prismaCall } from '@/services/prismaCall'
import prisma from '@/prisma'
import type { ReadPageInput } from '@/lib/paging/Types'
import type { OmegaquoteCursor, OmegaquoteFiltered } from '@/services/omegaquotes/Types'

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
