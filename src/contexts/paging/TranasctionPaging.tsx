'use client'

import { readTransactionsPage } from '@/actions/ledger/transactions/transactions'
import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import type { ReadPageInput } from '@/lib/paging/Types'
import { Transaction } from '@prisma/client'

export type PageSizeTransactions = 10
const fetcher = async (paging: ReadPageInput<PageSizeTransactions, { id: number }, { accountId: number }>) => {
    return readTransactionsPage({ paging })
}

export const TransactionPagingContext = generatePagingContext<
    Transaction,
    { id: number },
    PageSizeTransactions,
    { accountId: number }
>()
const TransactionPagingProvider = generatePagingProvider({
    Context: TransactionPagingContext,
    fetcher,
    getCursorAfterFetch: data => (data.length ? { id: data[data.length - 1].id } : null),
})
export default TransactionPagingProvider
