'use client'

import { generatePaging } from './PagingGenerator'
import { readLedgerAccountPageAction } from '@/services/ledger/ledgerAccount/actions'
import type { LedgerAccount, LedgerAccountType } from '@prisma/client'

export type PageSizeTransactions = 10

export const [LedgerAccountPagingContext, LedgerAccountPagingProvider] = generatePaging<
    LedgerAccount,
    { id: number },
    PageSizeTransactions,
    { accountType?: LedgerAccountType }
>({
    fetcher: (paging) => readLedgerAccountPageAction({ params: paging }),
    getCursor: ({ lastElement }) => ({ id: lastElement.id })
})
