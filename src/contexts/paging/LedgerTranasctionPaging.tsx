'use client'

import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readLedgerTransactionPageAction } from '@/services/ledger/ledgerTransactions/actions'
import type { ExpandedLedgerTransaction } from '@/services/ledger/ledgerTransactions/Type'

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
    getCursorAfterFetch: data => ({ id: data[data.length - 1].id }),
})

export default LedgerTransactionPagingProvider
