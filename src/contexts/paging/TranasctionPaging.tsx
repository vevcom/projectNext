'use client'

import generatePagingProvider, { generatePagingContext } from './PagingGenerator'
import { readTransactionsPage } from '@/actions/ledger/transactions/transactions'
import type { ReadPageInput } from '@/lib/paging/Types'
import type { Transaction } from '@prisma/client'

export type PageSizeTransactions = 10
const fetcher = async (
    paging: ReadPageInput<PageSizeTransactions, { id: number }, { accountId: number }>
) => readTransactionsPage({ paging })

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
