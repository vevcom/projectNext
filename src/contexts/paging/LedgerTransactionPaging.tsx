'use client'

import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readLedgerTransactionPageAction } from '@/services/ledger/ledgerTransactions/actions'
import type { ExpandedLedgerTransaction } from '@/services/ledger/ledgerTransactions/types'

// TODO: Might be possible to cleanup? Why is size a type???

export type PageSizeTransactions = 10

export const LedgerTransactionPagingContext = generatePagingContext<
    ExpandedLedgerTransaction,
    { id: number },
    PageSizeTransactions,
    { accountId: number }
>()
const LedgerTransactionPagingProvider = generatePagingProvider({
    Context: LedgerTransactionPagingContext,
    fetcher: (paging) => readLedgerTransactionPageAction({ paging }),
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})

// TODO: The "getCursorAfterFetch" function always just accesses the last element of the array,
// can't just the last eleement be passed in directly?

export default LedgerTransactionPagingProvider
