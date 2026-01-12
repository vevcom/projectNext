'use client'

import { generatePaging } from './PagingGenerator'
import { readLedgerTransactionPageAction } from '@/services/ledger/transactions/actions'
import type { ExpandedLedgerTransaction } from '@/services/ledger/transactions/types'

// TODO: Might be possible to cleanup? Why is size a type???
export type PageSizeTransactions = 10

export const [LedgerTransactionPagingContext, LedgerTransactionPagingProvider] = generatePaging<
    ExpandedLedgerTransaction,
    { id: number },
    PageSizeTransactions,
    { accountId: number }
>({
    fetcher: (paging) => readLedgerTransactionPageAction({ params: paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id }),
})
