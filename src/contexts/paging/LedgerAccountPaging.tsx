'use client'

import { generatePaging } from './PagingGenerator'
import { readLedgerAccountPageAction } from '@/services/ledger/accounts/actions'
import type { LedgerAccount, LedgerAccountType } from '@/prisma-generated-pn-types'

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
