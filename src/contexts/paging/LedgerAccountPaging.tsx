'use client'

import { LedgerAccount } from '@prisma/client'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readLedgerAccountPageAction } from '@/services/ledger/ledgerAccount/actions'
import { LedgerAccountType } from '@prisma/client'

// TODO: These paging functions always come in pairs, can we gave one function which generates both?

export type PageSizeTransactions = 10

export const LedgerAccountPagingContext = generatePagingContext<
    LedgerAccount,
    { id: number },
    PageSizeTransactions,
    { accountType?: LedgerAccountType }
>()

const LedgerAccountPagingProvider = generatePagingProvider({
    Context: LedgerAccountPagingContext,
    fetcher: (paging) => readLedgerAccountPageAction({ paging }),
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})

export default LedgerAccountPagingProvider
